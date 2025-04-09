import { decodeTime } from 'ulid'
import type { Sync } from '#context/Syncs.tsx'
import {
	CalendarIcon,
	ClockIcon,
	EndDateIcon,
	StartDateIcon,
} from './Icons.tsx'
import { ShortDate } from './ShortDate.tsx'
import { UserProfile } from '#components/UserProfile.tsx'
import { formatDay, formatTime, formatTimezone } from '#util/date.ts'

const FormattedDate = ({ date }: { date: Date }) => (
	<time dateTime={date.toISOString()} class="d-flex align-items-center">
		<CalendarIcon size={20} class="me-1" />
		{formatDay(date)}
		<ClockIcon size={20} class="ms-2 me-1" />
		{formatTime(date)}
		<small class="text-muted ms-1">{formatTimezone(date)}</small>
	</time>
)

export const SyncTitle = ({ sync }: { sync: Sync }) => (
	<>
		<p class="text-muted mb-0">
			<small>
				<a href={`/sync/${sync.id}`} style={{ color: 'inherit' }}>
					<ShortDate date={new Date(decodeTime(sync.id))} />
				</a>
			</small>
			<small class="mx-1">&middot;</small>
			<UserProfile id={sync.owner} />
		</p>
		<h1>{sync.title}</h1>
		{sync.inclusiveStartDate !== undefined && (
			<p class="d-flex align-items-center mb-0">
				<StartDateIcon class="ms-1 me-1" size={20} />
				<FormattedDate date={sync.inclusiveStartDate} />
			</p>
		)}
		{sync.inclusiveEndDate !== undefined && (
			<p class="d-flex align-items-center mb-0">
				<EndDateIcon class="ms-1 me-1" size={20} />
				<FormattedDate date={sync.inclusiveEndDate} />
			</p>
		)}
	</>
)
