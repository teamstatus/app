import type { ProblemDetail } from '#context/ProblemDetail.js'

type ProblemHandler = (problem: ProblemDetail) => unknown
type SuccessHandler<Response> = (result: Response) => unknown
type AnywayHandler = () => unknown
export type RequestResult<Result> = {
	fail: (problemHandler: ProblemHandler) => RequestResult<Result>
	ok: (resultHandler: SuccessHandler<Result>) => RequestResult<Result>
	anyway: (anywayHandler: AnywayHandler) => RequestResult<Result>
}

export const requestResult = <Result>(): {
	onFail: (problem: ProblemDetail) => unknown
	onSuccess: (result: Result) => unknown
	request: RequestResult<Result>
} => {
	const successHandler: SuccessHandler<Result>[] = []
	const problemHandler: ProblemHandler[] = []
	const anywayHandler: AnywayHandler[] = []

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

	return {
		request: r,
		onFail: (problem) => {
			problemHandler.map((handler) => handler(problem))
			anywayHandler.map((handler) => handler())
		},
		onSuccess: (result) => {
			successHandler.map((handler) => handler(result))
			anywayHandler.map((handler) => handler())
		},
	}
}
