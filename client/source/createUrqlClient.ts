
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
  CreateUserMutation,
  CurrentUserDocument,
  CurrentUserQuery,
  LoginWithPasswordMutation
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
            cache.updateQuery(
              { query: CurrentUserDocument },
              () => ({ currentUser: null })
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
