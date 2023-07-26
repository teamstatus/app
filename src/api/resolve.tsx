import { type RequestResult } from './client.js'

export const resolve = <Result extends Record<string, unknown>>(
	resolveWith: Result,
): RequestResult<Result> => ({
	anyway: (handler) => {
		handler()
		return resolve(resolveWith)
	},
	fail: () => {
		return resolve(resolveWith)
	},
	ok: (handler) => {
		handler(resolveWith)
		return resolve(resolveWith)
	},
})
