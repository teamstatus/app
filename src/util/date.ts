export const formatDay = (date: Date): string => date.toISOString().slice(0, 10)

export const formatTime = (date: Date): string =>
	new Intl.DateTimeFormat(undefined, {
		timeStyle: 'short',
	}).format(date)

export const formatTimezone = (date: Date): string =>
	new Intl.DateTimeFormat(undefined, {
		timeZoneName: 'longOffset',
	})
		.format(date)
		.split(', ')[1]
		?.slice(3) as string // e.g. -08:00

const rtf = new Intl.RelativeTimeFormat('en', {
	localeMatcher: 'best fit',
	numeric: 'always',
	style: 'long',
})
export const relativeTime = (date: Date, now = new Date()): string =>
	`about ${relaTime(date, now)}`

const relaTime = (date: Date, now: Date): string => {
	const delta = (now.getTime() - date.getTime()) / 1000
	if (delta < 60) return rtf.format(-Math.ceil(delta), 'seconds')
	if (delta < 60 * 60) return rtf.format(-Math.round(delta / 60), 'minutes')
	if (delta < 60 * 60 * 24)
		return rtf.format(-Math.round(delta / 60 / 60), 'hours')
	if (delta < 60 * 60 * 24 * 30)
		return rtf.format(-Math.round(delta / 60 / 60 / 24), 'days')
	if (delta < 60 * 60 * 24 * 30 * 12)
		return rtf.format(-Math.round(delta / 60 / 60 / 24 / 12), 'months')
	return rtf.format(-Math.round(delta / 60 / 60 / 24 / 12 / 356), 'years')
}

export const addMilliseconds = (date: Date, milliseconds: number): Date =>
	new Date(date.getTime() + milliseconds)
