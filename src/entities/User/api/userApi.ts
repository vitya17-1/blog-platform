//get current user data api using RTKQ inject
import blogApi from '@shared/lib/api';

const userSliceAPI = blogApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getMe: builder.query({
      query: (token: string) => ({
        url: '/user',
        headers: {
          Authorization: `JWT ${token}`,
        },
      }),
    }),
  }),
});
export const { useGetMeQuery } = userSliceAPI;
