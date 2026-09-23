import { useQuery } from "@tanstack/react-query"
import { fetchCities } from "./apiProfileSettings"

export const CITIES_QUERY_KEY = (countryCode: string, search: string) => [
  "cities",
  countryCode,
  search,
]

export const useCitiesQuery = (countryCode: string | null | undefined, search = "") => {
  return useQuery({
    queryKey: CITIES_QUERY_KEY(countryCode ?? "", search),
    queryFn: () => fetchCities(countryCode!, search || undefined),
    enabled: Boolean(countryCode),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  })
}
