import { InternalError } from '../context/InternalError.js'
import { type RequestResult } from './client.js'

export const notReady: RequestResult<Record<string, unknown>> = {
	anyway: (handler) => {
		handler()
		return notReady
	},
	fail: (handler) => {
		handler(InternalError('Not ready.'))
		return notReady
	},
	ok: () => {
		return notReady
	},
}
