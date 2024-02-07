import { relativeTime } from '#util/date.js'
import { useEffect, useState } from 'preact/hooks'

export const Ago = ({ date }: { date: Date }) => {
	const [relTime, setRelTime] = useState<string>(relativeTime(date))

	useEffect(() => {
		const i = setInterval(() => {
			setRelTime(relativeTime(date))
		}, 10 * 1000)

		return () => {
			clearInterval(i)
		}
	}, [date])

	return <time dateTime={date.toISOString()}>{relTime}</time>
}
