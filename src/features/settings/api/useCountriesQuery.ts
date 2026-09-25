import { useQuery } from "@tanstack/react-query"
import { fetchCountries } from "./apiProfileSettings"

export const COUNTRIES_QUERY_KEY = ["countries"]

export const useCountriesQuery = () => {
  return useQuery({
    queryKey: COUNTRIES_QUERY_KEY,
    queryFn: fetchCountries,
    staleTime: 5 * 60 * 1000,
  })
}
