import blogApi from '@shared/lib/api';

const authSliceAPI = blogApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => ({
        url: '/user',
      }),
    }),
    login: builder.mutation({
      query: (data: { user: { email: string; password: string } }) => ({
        url: '/users/login',
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data: {
        user: { email: string; password: string; username: string };
      }) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data: {
        user: {
          email: string;
          username: string;
          image?: string;
          bio?: string;
          password?: string;
        };
      }) => ({
        url: '/user',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLoginMutation,
  useRegisterMutation,
  useUpdateUserMutation,
} = authSliceAPI;
