import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Character, Planet, Film, Starship } from "../types/starwars";
import { API_CONSTANTS } from "../constants/text";

interface APIResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const starWarsApi = createApi({
  reducerPath: "starWarsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_CONSTANTS.BASE_URL }),
  endpoints: (builder) => ({
    getCharacters: builder.query<
      APIResponse<Character>,
      { page?: number; search?: string }
    >({
      query: ({ page = 1, search = "" }) =>
        `people/?page=${page}${search ? `&search=${search}` : ""}`,
    }),

    getCharacterById: builder.query<Character, string>({
      query: (id) => `people/${id}/`,
    }),

    getPlanetById: builder.query<Planet, string>({
      query: (id) => `planets/${id}/`,
    }),

    fetchFilms: builder.query<Film[], string[]>({
      async queryFn(urls, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const requests = urls.map(async (url) => {
            const path = url.replace(API_CONSTANTS.BASE_URL, "");
            const result = await fetchWithBQ(path);
            if (result.error) throw result.error;
            return result.data as Film;
          });

          const responses = await Promise.all(requests);
          return { data: responses };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: `Failed to fetch films: ${error}`,
            },
          };
        }
      },
    }),

    fetchStarships: builder.query<Starship[], string[]>({
      async queryFn(urls, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const requests = urls.map(async (url) => {
            const path = url.replace(API_CONSTANTS.BASE_URL, "");
            const result = await fetchWithBQ(path);
            if (result.error) throw result.error;
            return result.data as Starship;
          });

          const responses = await Promise.all(requests);
          return { data: responses };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: `Failed to fetch starships: ${error}`,
            },
          };
        }
      },
    }),
  }),
});

export const {
  useGetCharactersQuery,
  useGetCharacterByIdQuery,
  useGetPlanetByIdQuery,
  useFetchFilmsQuery,
  useFetchStarshipsQuery,
  useLazyGetCharactersQuery,
} = starWarsApi;
