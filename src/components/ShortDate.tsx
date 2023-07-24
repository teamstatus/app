export const ShortDate = ({ date }: { date: Date }) => (
	<time dateTime={date.toISOString()}>{date.toISOString().slice(0, 10)}</time>
)
