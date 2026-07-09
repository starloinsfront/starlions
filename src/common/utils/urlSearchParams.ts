export type SearchParamValue = string | string[] | undefined
export type SearchParamsRecord = Record<string, SearchParamValue>

export const getFirstSearchParamValue = (
  searchParams: SearchParamsRecord,
  key: string,
): string | undefined => {
  const value = searchParams[key]

  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

export const createSearchParamsString = (
  searchParams: SearchParamsRecord,
  omittedKeys: string[] = [],
) => {
  const omitted = new Set(omittedKeys)
  const params = new URLSearchParams()

  Object.entries(searchParams).forEach(([key, value]) => {
    if (omitted.has(key) || value === undefined) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item))
      return
    }

    params.set(key, value)
  })

  return params.toString()
}

export const buildPathWithSearchParams = (
  pathname: string,
  searchParams: SearchParamsRecord,
  omittedKeys: string[] = [],
) => {
  const query = createSearchParamsString(searchParams, omittedKeys)

  return query ? `${pathname}?${query}` : pathname
}
