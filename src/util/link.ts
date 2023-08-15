import { route } from 'preact-router'
import { withParams } from '#util/withParams.js'

export const navigateTo = (
	pathParams: string[],
	params?: Record<string, string | undefined>,
): ReturnType<typeof route> => route(linkUrl(pathParams, params))

export const linkUrl = (
	pathParams: string[],
	params?: Record<string, string | undefined>,
): string =>
	`/${pathParams.map((s) => encodeURIComponent(s)).join('/')}${withParams(
		params,
	)}`
