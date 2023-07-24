import { InternalError } from '#context/InternalError.js'
import { type RequestResult } from './client.js'

export const notReady = <
	Result extends Record<string, unknown>,
>(): RequestResult<Result> => ({
	anyway: (handler) => {
		handler()
		return notReady()
	},
	fail: (handler) => {
		handler(InternalError('Not ready.'))
		return notReady()
	},
	ok: () => {
		return notReady()
	},
})
