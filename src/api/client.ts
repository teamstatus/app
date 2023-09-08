import pThrottle from 'p-throttle'
import type { ProblemDetail } from '#context/ProblemDetail.js'
import { InternalError } from '#context/InternalError.js'
import { requestResult, type RequestResult } from '#api/requestResult.js'

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
	options?: { cacheError?: boolean; cache?: boolean },
): RequestResult<Result> => {
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
		method !== 'GET' ||
		// cache disabled
		options?.cache === false
	) {
		p = {
			ts: new Date(),
			request: throttle(async () =>
				fetch(url, {
					mode: 'cors',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json; charset=utf-8',
						Accept: 'application/json; charset=utf-8',
						...(requestOptions?.headers ?? {}),
					},
					...requestOptions,
				}),
			)().then(async (res) => {
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

	const { request, onFail, onSuccess } = requestResult<Result>()

	p.request
		.then((res) => {
			if ('problem' in res) {
				onFail(res.problem)
				if (options?.cacheError === false) delete requestPromise[key]
			}
			if ('result' in res) onSuccess(res.result)
		})
		.catch((error) => {
			console.error(error)
			onFail(InternalError((error as Error).message))
			if (options?.cacheError === false) delete requestPromise[key]
		})

	return request
}

export const GET = <Response extends Record<string, unknown>>(
	resource: string,
	options?: { cacheError?: boolean; cache?: boolean },
): RequestResult<Response> => request<Response>(resource, {}, options)

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
