import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type ApiKey = {
  __typename?: 'ApiKey';
  created_at: Scalars['DateTime'];
  expires?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  key: Scalars['String'];
  last_use?: Maybe<Scalars['DateTime']>;
  note: Scalars['String'];
  owner?: Maybe<User>;
  owner_id: Scalars['ID'];
  scopes?: Maybe<Array<ApiScope>>;
  updated_at: Scalars['DateTime'];
};

export type ApiScope = {
  __typename?: 'ApiScope';
  category?: Maybe<Array<ApiScopeCategory>>;
  category_id?: Maybe<Scalars['ID']>;
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type ApiScopeCategory = {
  __typename?: 'ApiScopeCategory';
  description: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  scopes: Array<ApiScope>;
};

export type ApiScopeInput = {
  id: Scalars['ID'];
};

export type CreateKeyResponse = {
  __typename?: 'CreateKeyResponse';
  api_key?: Maybe<ApiKey>;
  error?: Maybe<ServerError>;
  secret?: Maybe<CrypticoEncryptedKey>;
  validation_errors?: Maybe<Array<ValidationError>>;
};

export type CrypticoEncryptedKey = {
  __typename?: 'CrypticoEncryptedKey';
  cipher: Scalars['String'];
  status: Scalars['String'];
};

export type DeleteKeyResponse = {
  __typename?: 'DeleteKeyResponse';
  error?: Maybe<ServerError>;
  success?: Maybe<Scalars['Boolean']>;
};

export type Department = {
  __typename?: 'Department';
  history_responsibilities: Array<TicketHistory>;
  id: Scalars['String'];
  issued: Array<Ticket>;
  name: Scalars['String'];
  previous_ticket_responsibilities: Array<Ticket>;
  roles: Array<Role>;
  template_responsibilities: Array<TicketTemplate>;
  ticket_responsibilities: Array<Ticket>;
  users: Array<User>;
};

export type GetCategoriesResponse = {
  __typename?: 'GetCategoriesResponse';
  categories?: Maybe<Array<ApiScopeCategory>>;
  error?: Maybe<ServerError>;
};

export type GetKeysResponse = {
  __typename?: 'GetKeysResponse';
  errors?: Maybe<Array<ServerError>>;
  keys?: Maybe<Array<ApiKey>>;
  validation_errors?: Maybe<Array<ValidationError>>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken?: Maybe<Scalars['String']>;
  error?: Maybe<ServerError>;
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createApiKey: CreateKeyResponse;
  createTicket: TicketCreateResponse;
  deleteApiKey: DeleteKeyResponse;
  login: LoginResponse;
  updateTicket: TicketUpdateResponse;
};


export type MutationCreateApiKeyArgs = {
  expires_in: Scalars['String'];
  note: Scalars['String'];
  public_key: Scalars['String'];
  scopes: Array<ApiScopeInput>;
};


export type MutationCreateTicketArgs = {
  description: Scalars['String'];
  group_id?: Maybe<Scalars['String']>;
  issuer_department_id: Scalars['String'];
  issuer_id?: Maybe<Scalars['String']>;
  responsible_department_id: Scalars['String'];
  responsible_user_id: Scalars['String'];
  service_id: Scalars['String'];
  short_description: Scalars['String'];
  type: Scalars['String'];
};


export type MutationDeleteApiKeyArgs = {
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  client_id: Scalars['String'];
  mail: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpdateTicketArgs = {
  description?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  owner_group_id?: Maybe<Scalars['String']>;
  responsible_department_id?: Maybe<Scalars['String']>;
  responsible_user_id?: Maybe<Scalars['String']>;
  service_id?: Maybe<Scalars['String']>;
  short_description?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type Permission = {
  __typename?: 'Permission';
  id: Scalars['String'];
  name: Scalars['String'];
  roles: Array<Role>;
  users: Array<User>;
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
  getAllScopeCategories: GetCategoriesResponse;
  getKeysOfUser: GetKeysResponse;
  hi: Scalars['String'];
};


export type QueryGetKeysOfUserArgs = {
  user_id: Scalars['String'];
};

export type Role = {
  __typename?: 'Role';
  departments: Array<Department>;
  id: Scalars['String'];
  name: Scalars['String'];
  permissions: Array<Permission>;
  users: Array<User>;
};

export type ServerError = {
  __typename?: 'ServerError';
  message: Scalars['String'];
  name: Scalars['String'];
};

export type Service = {
  __typename?: 'Service';
  histories: Array<ServiceHistory>;
  id: Scalars['ID'];
  service_id: Scalars['String'];
  tickets: Array<Ticket>;
};

export type ServiceHistory = {
  __typename?: 'ServiceHistory';
  action: ServiceHistoryAction;
  action_id: Scalars['String'];
  created_at: Scalars['DateTime'];
  id: Scalars['ID'];
  responsible_user: User;
  responsible_user_id: Scalars['String'];
  service: Service;
  service_id: Scalars['String'];
};

export type ServiceHistoryAction = {
  __typename?: 'ServiceHistoryAction';
  histories: Array<ServiceHistory>;
  id: Scalars['ID'];
  type: Scalars['String'];
  value1: Scalars['String'];
  value2: Scalars['String'];
  value3: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  ticketCreated: Ticket;
  ticketUpdated: Ticket;
};


export type SubscriptionTicketUpdatedArgs = {
  id: Scalars['String'];
};

export type Ticket = {
  __typename?: 'Ticket';
  closed_at?: Maybe<Scalars['DateTime']>;
  created_at: Scalars['DateTime'];
  description: Scalars['String'];
  group?: Maybe<TicketGroup>;
  group_id: Scalars['ID'];
  histories: Array<TicketHistory>;
  id: Scalars['ID'];
  issuer?: Maybe<User>;
  issuer_department: Department;
  issuer_department_id: Scalars['ID'];
  issuer_id: Scalars['ID'];
  owner_group?: Maybe<TicketGroup>;
  owner_group_id: Scalars['String'];
  previous_responsible_department: Department;
  previous_responsible_department_id: Scalars['ID'];
  responsible_department: Department;
  responsible_department_id: Scalars['ID'];
  responsible_user?: Maybe<User>;
  responsible_user_id: Scalars['ID'];
  service: Service;
  service_id: Scalars['ID'];
  short_description: Scalars['String'];
  status: Scalars['String'];
  ticket_id: Scalars['String'];
  type: Scalars['String'];
  updated_at: Scalars['DateTime'];
};

export type TicketComment = {
  __typename?: 'TicketComment';
  content: Scalars['String'];
  created_at: Scalars['DateTime'];
  creator: User;
  creator_id: Scalars['String'];
  id: Scalars['ID'];
};

export type TicketCreateResponse = {
  __typename?: 'TicketCreateResponse';
  errors?: Maybe<Array<ServerError>>;
  ticket?: Maybe<Ticket>;
  validation_errors?: Maybe<Array<ValidationError>>;
};

export type TicketGroup = {
  __typename?: 'TicketGroup';
  id: Scalars['ID'];
  members: Array<Ticket>;
  owner: Ticket;
};

export type TicketHistory = {
  __typename?: 'TicketHistory';
  actions: Array<TicketHistoryAction>;
  created_at: Scalars['DateTime'];
  id: Scalars['ID'];
  responsible_department: Department;
  responsible_department_id: Scalars['String'];
  responsible_user: User;
  responsible_user_id: Scalars['String'];
  ticket: Ticket;
  ticket_id: Scalars['String'];
};

export type TicketHistoryAction = {
  __typename?: 'TicketHistoryAction';
  history: TicketHistory;
  history_id: Scalars['String'];
  id: Scalars['ID'];
  type: Scalars['String'];
  value1: Scalars['String'];
  value2: Scalars['String'];
  value3: Scalars['String'];
};

export type TicketTemplate = {
  __typename?: 'TicketTemplate';
  create_group: Scalars['Boolean'];
  description: Scalars['String'];
  group: TicketGroup;
  group_id: Scalars['String'];
  id: Scalars['ID'];
  issuer_department: Department;
  issuer_department_id: Scalars['ID'];
  responsible_department: Department;
  responsible_department_id: Scalars['String'];
  responsible_user: User;
  responsible_user_id: Scalars['String'];
  service: Service;
  service_id: Scalars['ID'];
  short_description: Scalars['String'];
  type: Scalars['String'];
};

export type TicketUpdateResponse = {
  __typename?: 'TicketUpdateResponse';
  errors?: Maybe<Array<ServerError>>;
  ticket?: Maybe<Ticket>;
  validation_errors?: Maybe<Array<ValidationError>>;
};

export type User = {
  __typename?: 'User';
  api_keys?: Maybe<Array<ApiKey>>;
  department: Department;
  department_id: Scalars['String'];
  displayName: Scalars['String'];
  history_responsibilities: Array<TicketHistory>;
  id: Scalars['String'];
  issued: Array<Ticket>;
  mail: Scalars['String'];
  permissions: Array<Permission>;
  phoneNumber: Scalars['String'];
  roles: Array<Role>;
  settings: UserSetting;
  settings_id: Scalars['String'];
  template_responsibilities: Array<TicketTemplate>;
  ticket_comment_responsibilities: Array<TicketComment>;
  ticket_responsibilities: Array<Ticket>;
  username: Scalars['String'];
};

export type UserSetting = {
  __typename?: 'UserSetting';
  day_theme: Scalars['String'];
  id: Scalars['String'];
  night_theme: Scalars['String'];
  notification_assign_ticket: Array<Scalars['String']>;
  notification_assigned_ticket_change: Array<Scalars['String']>;
  notification_watching_ticket_change: Array<Scalars['String']>;
  public_profile: Scalars['Boolean'];
  user: User;
};

export type ValidationError = {
  __typename?: 'ValidationError';
  field: Scalars['String'];
  long_message?: Maybe<Scalars['String']>;
  message: Scalars['String'];
};

export type CreateApiKeyMutationVariables = Exact<{
  scopes: Array<ApiScopeInput> | ApiScopeInput;
  publicKey: Scalars['String'];
  expiresIn: Scalars['String'];
  note: Scalars['String'];
}>;


export type CreateApiKeyMutation = { __typename?: 'Mutation', createApiKey: { __typename?: 'CreateKeyResponse', secret?: { __typename?: 'CrypticoEncryptedKey', cipher: string, status: string } | null | undefined, error?: { __typename?: 'ServerError', name: string, message: string } | null | undefined, validation_errors?: Array<{ __typename?: 'ValidationError', field: string, message: string }> | null | undefined } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, username: string, displayName: string, mail: string } | null | undefined };

export type DeleteApiKeyMutationVariables = Exact<{
  deleteApiKeyId: Scalars['String'];
}>;


export type DeleteApiKeyMutation = { __typename?: 'Mutation', deleteApiKey: { __typename?: 'DeleteKeyResponse', success?: boolean | null | undefined, error?: { __typename?: 'ServerError', name: string, message: string } | null | undefined } };

export type GetAllScopeCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllScopeCategoriesQuery = { __typename?: 'Query', getAllScopeCategories: { __typename?: 'GetCategoriesResponse', categories?: Array<{ __typename?: 'ApiScopeCategory', id: string, name: string, description: string, scopes: Array<{ __typename?: 'ApiScope', id: string, name: string, description: string }> }> | null | undefined, error?: { __typename?: 'ServerError', name: string, message: string } | null | undefined } };

export type GetKeysOfUserQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GetKeysOfUserQuery = { __typename?: 'Query', getKeysOfUser: { __typename?: 'GetKeysResponse', keys?: Array<{ __typename?: 'ApiKey', id: string, note: string, expires?: any | null | undefined, last_use?: any | null | undefined, scopes?: Array<{ __typename?: 'ApiScope', id: string, name: string }> | null | undefined }> | null | undefined } };

export type LoginMutationVariables = Exact<{
  password: Scalars['String'];
  mail: Scalars['String'];
  clientId: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', accessToken?: string | null | undefined, user?: { __typename?: 'User', id: string, username: string, displayName: string, mail: string } | null | undefined, error?: { __typename?: 'ServerError', name: string, message: string } | null | undefined } };


export const CreateApiKeyDocument = gql`
    mutation createApiKey($scopes: [ApiScopeInput!]!, $publicKey: String!, $expiresIn: String!, $note: String!) {
  createApiKey(
    public_key: $publicKey
    expires_in: $expiresIn
    note: $note
    scopes: $scopes
  ) {
    secret {
      cipher
      status
    }
    error {
      name
      message
    }
    validation_errors {
      field
      message
    }
  }
}
    `;
export type CreateApiKeyMutationFn = Apollo.MutationFunction<CreateApiKeyMutation, CreateApiKeyMutationVariables>;

/**
 * __useCreateApiKeyMutation__
 *
 * To run a mutation, you first call `useCreateApiKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateApiKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createApiKeyMutation, { data, loading, error }] = useCreateApiKeyMutation({
 *   variables: {
 *      scopes: // value for 'scopes'
 *      publicKey: // value for 'publicKey'
 *      expiresIn: // value for 'expiresIn'
 *      note: // value for 'note'
 *   },
 * });
 */
export function useCreateApiKeyMutation(baseOptions?: Apollo.MutationHookOptions<CreateApiKeyMutation, CreateApiKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateApiKeyMutation, CreateApiKeyMutationVariables>(CreateApiKeyDocument, options);
      }
export type CreateApiKeyMutationHookResult = ReturnType<typeof useCreateApiKeyMutation>;
export type CreateApiKeyMutationResult = Apollo.MutationResult<CreateApiKeyMutation>;
export type CreateApiKeyMutationOptions = Apollo.BaseMutationOptions<CreateApiKeyMutation, CreateApiKeyMutationVariables>;
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    id
    username
    displayName
    mail
  }
}
    `;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
      }
export function useCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export const DeleteApiKeyDocument = gql`
    mutation deleteApiKey($deleteApiKeyId: String!) {
  deleteApiKey(id: $deleteApiKeyId) {
    success
    error {
      name
      message
    }
  }
}
    `;
export type DeleteApiKeyMutationFn = Apollo.MutationFunction<DeleteApiKeyMutation, DeleteApiKeyMutationVariables>;

/**
 * __useDeleteApiKeyMutation__
 *
 * To run a mutation, you first call `useDeleteApiKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteApiKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteApiKeyMutation, { data, loading, error }] = useDeleteApiKeyMutation({
 *   variables: {
 *      deleteApiKeyId: // value for 'deleteApiKeyId'
 *   },
 * });
 */
export function useDeleteApiKeyMutation(baseOptions?: Apollo.MutationHookOptions<DeleteApiKeyMutation, DeleteApiKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteApiKeyMutation, DeleteApiKeyMutationVariables>(DeleteApiKeyDocument, options);
      }
export type DeleteApiKeyMutationHookResult = ReturnType<typeof useDeleteApiKeyMutation>;
export type DeleteApiKeyMutationResult = Apollo.MutationResult<DeleteApiKeyMutation>;
export type DeleteApiKeyMutationOptions = Apollo.BaseMutationOptions<DeleteApiKeyMutation, DeleteApiKeyMutationVariables>;
export const GetAllScopeCategoriesDocument = gql`
    query getAllScopeCategories {
  getAllScopeCategories {
    categories {
      id
      name
      description
      scopes {
        id
        name
        description
      }
    }
    error {
      name
      message
    }
  }
}
    `;

/**
 * __useGetAllScopeCategoriesQuery__
 *
 * To run a query within a React component, call `useGetAllScopeCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllScopeCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllScopeCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllScopeCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllScopeCategoriesQuery, GetAllScopeCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllScopeCategoriesQuery, GetAllScopeCategoriesQueryVariables>(GetAllScopeCategoriesDocument, options);
      }
export function useGetAllScopeCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllScopeCategoriesQuery, GetAllScopeCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllScopeCategoriesQuery, GetAllScopeCategoriesQueryVariables>(GetAllScopeCategoriesDocument, options);
        }
export type GetAllScopeCategoriesQueryHookResult = ReturnType<typeof useGetAllScopeCategoriesQuery>;
export type GetAllScopeCategoriesLazyQueryHookResult = ReturnType<typeof useGetAllScopeCategoriesLazyQuery>;
export type GetAllScopeCategoriesQueryResult = Apollo.QueryResult<GetAllScopeCategoriesQuery, GetAllScopeCategoriesQueryVariables>;
export const GetKeysOfUserDocument = gql`
    query getKeysOfUser($userId: String!) {
  getKeysOfUser(user_id: $userId) {
    keys {
      id
      note
      scopes {
        id
        name
      }
      expires
      last_use
    }
  }
}
    `;

/**
 * __useGetKeysOfUserQuery__
 *
 * To run a query within a React component, call `useGetKeysOfUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetKeysOfUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetKeysOfUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetKeysOfUserQuery(baseOptions: Apollo.QueryHookOptions<GetKeysOfUserQuery, GetKeysOfUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetKeysOfUserQuery, GetKeysOfUserQueryVariables>(GetKeysOfUserDocument, options);
      }
export function useGetKeysOfUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetKeysOfUserQuery, GetKeysOfUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetKeysOfUserQuery, GetKeysOfUserQueryVariables>(GetKeysOfUserDocument, options);
        }
export type GetKeysOfUserQueryHookResult = ReturnType<typeof useGetKeysOfUserQuery>;
export type GetKeysOfUserLazyQueryHookResult = ReturnType<typeof useGetKeysOfUserLazyQuery>;
export type GetKeysOfUserQueryResult = Apollo.QueryResult<GetKeysOfUserQuery, GetKeysOfUserQueryVariables>;
export const LoginDocument = gql`
    mutation Login($password: String!, $mail: String!, $clientId: String!) {
  login(password: $password, mail: $mail, client_id: $clientId) {
    user {
      id
      username
      displayName
      mail
    }
    accessToken
    error {
      name
      message
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      password: // value for 'password'
 *      mail: // value for 'mail'
 *      clientId: // value for 'clientId'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;