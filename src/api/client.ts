import pThrottle from 'p-throttle'
import type { ProblemDetail } from '#context/ProblemDetail.js'
import { InternalError } from '#context/InternalError.js'

type ProblemHandler = (problem: ProblemDetail) => unknown
type SuccessHandler<Response extends Record<string, unknown>> = (
	result: Response,
) => unknown
type AnywayHandler = () => unknown
export type RequestResult<Result extends Record<string, unknown>> = {
	fail: (problemHandler: ProblemHandler) => RequestResult<Result>
	ok: (resultHandler: SuccessHandler<Result>) => RequestResult<Result>
	anyway: (anywayHandler: AnywayHandler) => RequestResult<Result>
}

export const throttle = pThrottle({
	limit: 2,
	interval: 250,
})

type CachedRequest<Result extends Record<string, unknown>> = {
	request: Promise<{ problem: ProblemDetail } | { result: Result }>
	ts: Date
}
const requestPromise: Record<string, CachedRequest<any>> = {}

export const request = <Result extends Record<string, unknown>>(
	resource: string,
	requestOptions?: RequestInit,
): RequestResult<Result> => {
	const successHandler: SuccessHandler<Result>[] = []
	const problemHandler: ProblemHandler[] = []
	const anywayHandler: AnywayHandler[] = []

	const method = requestOptions?.method ?? 'GET'
	const base = new URL(API_ENDPOINT)
	const url = new URL(
		`${base.pathname.replace(/\/+$/, '')}/${resource.replace(/^\//, '')}`,
		base,
	)
	const key = `${method} ${url.toString()}`
	let p: CachedRequest<Result> | undefined = requestPromise[key]
	if (
		p === undefined ||
		// Cache time expired
		p.ts.getTime() + 60 * 60 * 1000 < Date.now() ||
		// Not a cacheable method
		method !== 'GET'
	) {
		p = {
			ts: new Date(),
			request: fetch(url, {
				mode: 'cors',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					Accept: 'application/json; charset=utf-8',
					...(requestOptions?.headers ?? {}),
				},
				...requestOptions,
			}).then(async (res) => {
				if (
					res.headers
						.get('content-type')
						?.includes('application/problem+json') ??
					false
				) {
					const problem = await res.json()
					console.error(problem)
					return { problem }
				} else if (!res.ok) {
					return { problem: InternalError(await res.text()) }
				} else if (
					(res.headers.get('content-type')?.includes('application/json') ??
						false) &&
					parseInt(res.headers.get('content-length') ?? '0', 10) > 0
				) {
					return { result: await res.json() }
				}
				return { result: null }
			}),
		}
		requestPromise[key] = p
	}

	p.request
		.then((res) => {
			if ('problem' in res)
				problemHandler.map((handler) => handler(res.problem))
			if ('result' in res) successHandler.map((handler) => handler(res.result))
			anywayHandler.map((handler) => handler())
		})
		.catch((error) => {
			console.error(error)
			problemHandler.map((handler) =>
				handler(InternalError((error as Error).message)),
			)
		})

	const r: RequestResult<Result> = {
		fail: (handler) => {
			problemHandler.push(handler)
			return r
		},
		ok: (handler) => {
			successHandler.push(handler)
			return r
		},
		anyway: (handler) => {
			anywayHandler.push(handler)
			return r
		},
	}

	return r
}

export const GET = <Response extends Record<string, unknown>>(
	resource: string,
): RequestResult<Response> => request<Response>(resource)

export const CREATE = <Response extends Record<string, unknown>>(
	resource: string,
	body: Record<string, unknown>,
): RequestResult<Response> =>
	request<Response>(resource, {
		method: 'POST',
		body: JSON.stringify(body),
	})
export const UPDATE = <Response extends Record<string, unknown>>(
	resource: string,
	body: Record<string, unknown>,
	version: number,
): RequestResult<Response> =>
	request<Response>(resource, {
		method: 'PATCH',
		body: JSON.stringify(body),
		headers: {
			'if-match': version.toString(),
		},
	})

export const DELETE = <Response extends Record<string, unknown>>(
	resource: string,
	version: number,
): RequestResult<Response> =>
	request<Response>(resource, {
		method: 'DELETE',
		headers: {
			'if-match': version.toString(),
		},
	})
