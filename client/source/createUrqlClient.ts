
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
  AllDeletedProjectsDocument,
  AllDeletedProjectsQuery,
  AllProjectsDocument,
  AllProjectsQuery,
  CreateProjectMutation,
  CreateProjectMutationVariables,
  CreateUserMutation,
  CurrentUserDocument,
  CurrentUserQuery,
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
  LoginWithPasswordMutation,
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
            cache.invalidate('Query', 'allDeletedProjects')

            cache.updateQuery(
              { query: AllProjectsDocument },
              (data: AllProjectsQuery | null) => ({ projects: (data?.projects || []).filter((project) => project.id !== args.id) })
            )
          },

          restoreProject(result: RestoreProjectMutation, args: RestoreProjectMutationVariables, cache, info) {
            cache.invalidate('Query', 'allProjects')

            cache.updateQuery(
              { query: AllDeletedProjectsDocument },
              (data: AllDeletedProjectsQuery | null) => ({ projects: (data?.projects || []).filter((project) => project.id !== args.id) })
            )
          },
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
