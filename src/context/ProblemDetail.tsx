/**
 * Problem Details Object
 *
 * @see https://datatracker.ietf.org/doc/draft-ietf-httpapi-rfc7807bis/
 */

export type ProblemDetail = {
	type: URL
	status: number
	title: string
	detail?: string
}
