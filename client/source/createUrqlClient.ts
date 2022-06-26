
import {
  cacheExchange
} from "@urql/exchange-graphcache";
import {
  createClient,
  dedupExchange,
  errorExchange,
  fetchExchange
} from "urql";
import { API_URL } from './constants';
import {
  AddTodoMutation,
  AddTodoMutationVariables, AllProjectsDocument,
  AllProjectsQuery,
  CreateProjectMutation,
  CreateProjectMutationVariables,
  CreateUserMutation,
  CurrentUserDocument,
  CurrentUserQuery,
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
  FindProjectByIdDocument, FindProjectByIdQuery, LoginWithPasswordMutation, RemoveTodoMutation,
  RemoveTodoMutationVariables,
  RestoreProjectMutation,
  RestoreProjectMutationVariables
} from "./generated/graphql";

export const createUrqlClient = () => createClient({
  url: API_URL,
  fetchOptions: { credentials: "include" },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          loginWithPassword(result: LoginWithPasswordMutation, args, cache, info) {
            cache.updateQuery({ query: CurrentUserDocument }, (data: CurrentUserQuery | null) => {
              if (result.loginWithPassword.errors) return data;
              else return { currentUser: result.loginWithPassword.user };
            })
          },

          createUser(result: CreateUserMutation, args, cache, info) {
            cache.updateQuery({ query: CurrentUserDocument }, (data: CurrentUserQuery | null) => {
              if (result.createUser.errors) return data;
              else return { currentUser: result.createUser.user };
            })
          },

          logout(result, args, cache, info) {
            // NOTE: I invalidate every query manually, since there is not a direct or simple
            //       way to invalidate the whole cache at once.
            // See: https://github.com/FormidableLabs/urql/issues/297

            cache.invalidate('Query', 'currentUser')
            cache.invalidate('Query', 'allProjects')
            cache.invalidate('Query', 'allDeletedProjects')
          },

          createProject(result: CreateProjectMutation, args: CreateProjectMutationVariables, cache, info) {
            cache.updateQuery(
              { query: AllProjectsDocument },
              // NOTE: Append created project at the end.
              (data: AllProjectsQuery | null) => ({ projects: [...(data?.projects || []), result.project] })
            )
          },

          deleteProject(result: DeleteProjectMutation, args: DeleteProjectMutationVariables, cache, info) {
            cache.invalidate({ __typename: 'Project', id: args.id })
            cache.invalidate('Query', 'allDeletedProjects')
          },

          restoreProject(result: RestoreProjectMutation, args: RestoreProjectMutationVariables, cache, info) {
            cache.invalidate({ __typename: 'Project', id: args.id })
            cache.invalidate('Query', 'allProjects')
          },

          addTodo(result: AddTodoMutation, args: AddTodoMutationVariables, cache, info) {
            // This query may return `null` or `undefined`
            if (!result.todo) return

            cache.updateQuery(
              {
                query: FindProjectByIdDocument,
                variables: { id: args.projectId }
              },
              (data: FindProjectByIdQuery | null) => {
                if (!data || !data.project) return data
                data.project.todos.push(result.todo!)
                return data
              }
            )
          },

          removeTodo(result: RemoveTodoMutation, args: RemoveTodoMutationVariables, cache, info) {
            cache.invalidate({ __typename: 'Todo', id: args.id })
          }
        },
      },
    }),
    errorExchange({
      onError: (error) => {
        const isAuthError = error.message.includes('not authenticated')

        if (isAuthError) window.location.replace('/login')
      }
    }),
    fetchExchange,
  ],
})
