import { InternalError } from '#context/InternalError.tsx'
import type { RequestResult } from '#api/requestResult.ts'

export const notReady = <Result>(): RequestResult<Result> => ({
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
