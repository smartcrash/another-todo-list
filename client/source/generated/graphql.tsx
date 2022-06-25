import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AuthenticationResponse = {
  __typename?: 'AuthenticationResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createProject: Project;
  createUser: AuthenticationResponse;
  deleteProject?: Maybe<Scalars['Int']>;
  loginWithPassword: AuthenticationResponse;
  logout: Scalars['Boolean'];
  restoreProject?: Maybe<Scalars['Int']>;
  updateProject?: Maybe<Project>;
};


export type MutationCreateProjectArgs = {
  title: Scalars['String'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['Int'];
};


export type MutationLoginWithPasswordArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRestoreProjectArgs = {
  id: Scalars['Int'];
};


export type MutationUpdateProjectArgs = {
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
};

export type Project = {
  __typename?: 'Project';
  createdAt: Scalars['String'];
  deletedAt?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
  slug: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  allDeletedProjects: Array<Project>;
  allProjects: Array<Project>;
  currentUser?: Maybe<User>;
  findProjectById?: Maybe<Project>;
  findProjectBySlug?: Maybe<Project>;
};


export type QueryFindProjectByIdArgs = {
  id: Scalars['Int'];
};


export type QueryFindProjectBySlugArgs = {
  slug: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Float'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type ProjectFragmentFragment = { __typename?: 'Project', id: number, title: string, slug: string, createdAt: string, updatedAt: string, deletedAt?: string | null };

export type UserFragmentFragment = { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string };

export type CreateProjectMutationVariables = Exact<{
  title: Scalars['String'];
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', project: { __typename?: 'Project', id: number, title: string, slug: string, createdAt: string, updatedAt: string, deletedAt?: string | null } };

export type CreateUserMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'AuthenticationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string } | null } };

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteProjectMutation = { __typename?: 'Mutation', id?: number | null };

export type LoginWithPasswordMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type LoginWithPasswordMutation = { __typename?: 'Mutation', loginWithPassword: { __typename?: 'AuthenticationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RestoreProjectMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type RestoreProjectMutation = { __typename?: 'Mutation', id?: number | null };

export type AllDeletedProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllDeletedProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', id: number, title: string, slug: string, createdAt: string, updatedAt: string, deletedAt?: string | null }> };

export type AllProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', id: number, title: string, slug: string, createdAt: string, updatedAt: string, deletedAt?: string | null }> };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string } | null };

export type FindProjectBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type FindProjectBySlugQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: number, title: string, slug: string, createdAt: string, updatedAt: string, deletedAt?: string | null } | null };

export const ProjectFragmentFragmentDoc = gql`
    fragment ProjectFragment on Project {
  id
  title
  slug
  createdAt
  updatedAt
  deletedAt
}
    `;
export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  id
  username
  email
  createdAt
  updatedAt
}
    `;
export const CreateProjectDocument = gql`
    mutation CreateProject($title: String!) {
  project: createProject(title: $title) {
    ...ProjectFragment
  }
}
    ${ProjectFragmentFragmentDoc}`;

export function useCreateProjectMutation() {
  return Urql.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument);
};
export const CreateUserDocument = gql`
    mutation CreateUser($password: String!, $email: String!, $username: String!) {
  createUser(password: $password, email: $email, username: $username) {
    errors {
      field
      message
    }
    user {
      ...UserFragment
    }
  }
}
    ${UserFragmentFragmentDoc}`;

export function useCreateUserMutation() {
  return Urql.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument);
};
export const DeleteProjectDocument = gql`
    mutation DeleteProject($id: Int!) {
  id: deleteProject(id: $id)
}
    `;

export function useDeleteProjectMutation() {
  return Urql.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument);
};
export const LoginWithPasswordDocument = gql`
    mutation LoginWithPassword($password: String!, $email: String!) {
  loginWithPassword(password: $password, email: $email) {
    errors {
      field
      message
    }
    user {
      ...UserFragment
    }
  }
}
    ${UserFragmentFragmentDoc}`;

export function useLoginWithPasswordMutation() {
  return Urql.useMutation<LoginWithPasswordMutation, LoginWithPasswordMutationVariables>(LoginWithPasswordDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RestoreProjectDocument = gql`
    mutation RestoreProject($id: Int!) {
  id: restoreProject(id: $id)
}
    `;

export function useRestoreProjectMutation() {
  return Urql.useMutation<RestoreProjectMutation, RestoreProjectMutationVariables>(RestoreProjectDocument);
};
export const AllDeletedProjectsDocument = gql`
    query AllDeletedProjects {
  projects: allDeletedProjects {
    ...ProjectFragment
  }
}
    ${ProjectFragmentFragmentDoc}`;

export function useAllDeletedProjectsQuery(options?: Omit<Urql.UseQueryArgs<AllDeletedProjectsQueryVariables>, 'query'>) {
  return Urql.useQuery<AllDeletedProjectsQuery>({ query: AllDeletedProjectsDocument, ...options });
};
export const AllProjectsDocument = gql`
    query AllProjects {
  projects: allProjects {
    ...ProjectFragment
  }
}
    ${ProjectFragmentFragmentDoc}`;

export function useAllProjectsQuery(options?: Omit<Urql.UseQueryArgs<AllProjectsQueryVariables>, 'query'>) {
  return Urql.useQuery<AllProjectsQuery>({ query: AllProjectsDocument, ...options });
};
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

export function useCurrentUserQuery(options?: Omit<Urql.UseQueryArgs<CurrentUserQueryVariables>, 'query'>) {
  return Urql.useQuery<CurrentUserQuery>({ query: CurrentUserDocument, ...options });
};
export const FindProjectBySlugDocument = gql`
    query FindProjectBySlug($slug: String!) {
  project: findProjectBySlug(slug: $slug) {
    ...ProjectFragment
  }
}
    ${ProjectFragmentFragmentDoc}`;

export function useFindProjectBySlugQuery(options: Omit<Urql.UseQueryArgs<FindProjectBySlugQueryVariables>, 'query'>) {
  return Urql.useQuery<FindProjectBySlugQuery>({ query: FindProjectBySlugDocument, ...options });
};