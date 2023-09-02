import { InternalError } from '#context/InternalError.js'
import type { RequestResult } from '#api/requestResult.js'

export const notReady = <Result,>(): RequestResult<Result> => ({
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
