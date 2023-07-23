import type { ProblemDetail } from './ProblemDetail'

export const handleResponse = async <Result extends Record<string, unknown>>(
	res: Response,
): Promise<{ error: ProblemDetail } | { result: Result | null }> => {
	if (
		res.headers.get('content-type')?.includes('application/problem+json') ??
		false
	) {
		const problem = await res.json()
		return { error: problem }
	}
	if (
		(res.headers.get('content-type')?.includes('application/json') ?? false) &&
		parseInt(res.headers.get('content-length') ?? '0', 10) > 0
	) {
		return { result: (await res.json()) as Result }
	}
	return { result: null }
}
