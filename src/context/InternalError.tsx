import { type ProblemDetail } from './ProblemDetail.js'

export const InternalError = (message?: string): ProblemDetail => ({
	type: new URL(`https://teamstatus.space/error/InternalError`),
	status: 500,
	title: message ?? 'An internal error occurred.',
})
