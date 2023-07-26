import { format } from 'date-fns'
import { decodeTime } from 'ulid'
import { type Sync } from '#context/Syncs.js'
import { CalendarIcon, ClockIcon, EndDateIcon, StartDateIcon } from './Icons.js'
import { ShortDate } from './ShortDate.js'
import { UserProfile } from '#components/UserProfile.js'

const FormattedDate = ({ date }: { date: Date }) => (
	<time dateTime={date.toISOString()} class="d-flex align-items-center">
		<CalendarIcon size={20} class="me-1" />
		{format(date, 'yyyy-MM-dd')}
		<ClockIcon size={20} class="ms-2 me-1" />
		{format(date, 'HH:mm')}
		<small class="text-muted ms-1">{format(date, 'xxx')}</small>
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
