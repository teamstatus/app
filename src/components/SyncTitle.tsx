import { format } from 'date-fns'
import { decodeTime } from 'ulid'
import { type Sync } from '../context/Syncs.js'
import {
	BackIcon,
	CalendarIcon,
	ClockIcon,
	EndDateIcon,
	StartDateIcon,
} from './Icons.js'

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
		<nav class="d-flex align-items-center">
			<a href="/syncs">
				<BackIcon /> back
			</a>
		</nav>
		<h1>{sync.title}</h1>
		<dl>
			<dt>Created</dt>
			<dd>
				<FormattedDate date={new Date(decodeTime(sync.id))} />
			</dd>
			{sync.inclusiveStartDate !== undefined && (
				<>
					<dt>
						Status including from <StartDateIcon class="ms-1 me-1" size={20} />
					</dt>
					<dd>
						<FormattedDate date={sync.inclusiveStartDate} />
					</dd>
				</>
			)}
			{sync.inclusiveEndDate !== undefined && (
				<>
					<dt>
						Status including until <EndDateIcon class="ms-1 me-1" size={20} />
					</dt>
					<dd>
						<time dateTime={sync.inclusiveEndDate.toISOString()}>
							<FormattedDate date={sync.inclusiveEndDate} />
						</time>
					</dd>
				</>
			)}
		</dl>
	</>
)
