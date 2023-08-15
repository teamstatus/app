export const withParams = (
	params?: Record<string, string | undefined>,
): string => {
	if (params === undefined) return ''
	const definedParams: Record<string, string> = {}
	for (const [k, v] of Object.entries(params)) {
		if (v === undefined) continue
		definedParams[k] = v
	}
	if (Object.keys(definedParams).length === 0) return ''
	return `?${new URLSearchParams(definedParams).toString()}`
}
