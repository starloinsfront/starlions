import { useQuery } from "@tanstack/react-query"
import { fetchCities } from "./apiProfileSettings"

export const CITIES_QUERY_KEY = (countryCode: string) => ["cities", countryCode]

export const useCitiesQuery = (countryCode: string | null | undefined) => {
  return useQuery({
    queryKey: CITIES_QUERY_KEY(countryCode ?? ""),
    queryFn: () => fetchCities(countryCode!),
    enabled: Boolean(countryCode),
    staleTime: 5 * 60 * 1000,
  })
}
