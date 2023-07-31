import cx from 'classnames'
import { useState } from 'preact/hooks'
import { type Project } from '#context/Projects.js'
import { useSyncs } from '#context/Syncs.js'
import { ApplyIcon, BackIcon, SubmitIcon } from './Icons.js'

export const SyncSettings = ({
	projects,
	onUpdate,
}: {
	projects: Project[]
	onUpdate: (
		selectedProjects: string[],
		startDate?: Date,
		endDate?: Date,
	) => void
}) => {
	const { addSync } = useSyncs()
	const [startDay, setStartDay] = useState('') // '2023-06-11'
	const [endDay, setEndDay] = useState('') // '2023-06-11'
	const [startTime, setStartTime] = useState('00:00') // '00:35'
	const [endTime, setEndTime] = useState('00:00') // '00:35'
	const [selectedProjects, setSelectedProjects] = useState<string[]>([])
	const [name, setName] = useState('')
	const [createdSyncId, setCreatedSyncId] = useState<string>()

	const startDate =
		startDay.length > 0 && startTime.length > 0
			? new Date(`${startDay}T${startTime}:00`)
			: undefined
	const endDate =
		endDay.length > 0 && endTime.length > 0
			? new Date(`${endDay}T${endTime}:00`)
			: undefined

	const isValid =
		name.length > 0 &&
		(startDate?.getTime() ?? Number.MIN_SAFE_INTEGER) <
			(endDate?.getTime() ?? Number.MAX_SAFE_INTEGER)

	return (
		<section>
			<label class="mb-2">Projects</label>
			{projects.map((project) => (
				<div class="form-check">
					<label htmlFor={project.id}>
						<input
							class="form-check-input"
							type="checkbox"
							id={project.id}
							onClick={() => {
								setSelectedProjects((selectedProjects) =>
									selectedProjects.includes(project.id)
										? selectedProjects.filter((id) => id !== project.id)
										: [...selectedProjects, project.id],
								)
							}}
							checked={selectedProjects.includes(project.id)}
						/>
						{project.id}
					</label>
				</div>
			))}
			{Object.values(projects).length === 0 && (
				<div>
					<p>You have no projects,yet.</p>
					<p>
						<a href="/project/create">Create a new project</a>, or ask to be
						invited to an existing one.
					</p>
				</div>
			)}
			<div class={'row mt-3'}>
				<div class="col mb-3">
					<label for="startDate" class="form-label">
						Start day
					</label>
					<input
						type="date"
						class="form-control"
						id="startDate"
						value={startDay}
						onInput={(e) => setStartDay((e.target as HTMLInputElement).value)}
					/>
				</div>
				<div class="col mb-3">
					<label for="startTime" class="form-label">
						Start time
					</label>
					<input
						type="time"
						class="form-control"
						id="startTime"
						value={startTime}
						onInput={(e) => setStartTime((e.target as HTMLInputElement).value)}
					/>
				</div>
			</div>
			<div class={'row'}>
				<div class="col mb-3">
					<label for="endDate" class="form-label">
						End day
					</label>
					<input
						type="date"
						class="form-control"
						id="endDate"
						value={endDay}
						onInput={(e) => setEndDay((e.target as HTMLInputElement).value)}
					/>
				</div>
				<div class="col mb-3">
					<label for="endTime" class="form-label">
						End time
					</label>
					<input
						type="time"
						class="form-control"
						id="endTime"
						value={endTime}
						onInput={(e) => setEndTime((e.target as HTMLInputElement).value)}
					/>
				</div>
			</div>
			<div>
				<label for="name" class="form-label">
					Name
				</label>
				<input
					type="text"
					class="form-control"
					id="name"
					placeholder={`e.g. "Weekly sync meeting"`}
					value={name}
					onInput={(e) => setName((e.target as HTMLInputElement).value)}
				/>
			</div>
			<div class="d-flex align-items-center justify-content-between mt-4">
				<span>
					<a href={`/`} class="btn btn-outline-secondary">
						<BackIcon />
					</a>
				</span>
				<span>
					<button
						class={cx('btn', {
							'btn-primary': isValid,
							'btn-secondary': !isValid,
						})}
						disabled={!isValid}
						onClick={() => {
							const res = addSync(selectedProjects, name, startDate, endDate)
							if ('id' in res) setCreatedSyncId(res.id)
						}}
					>
						<SubmitIcon />
					</button>
					<button
						class={'btn btn-secondary ms-1'}
						onClick={() => {
							onUpdate(selectedProjects, startDate, endDate)
						}}
					>
						<ApplyIcon />
					</button>
				</span>
			</div>
			{createdSyncId !== undefined && (
				<div class="alert alert-success mt-4" role="alert">
					Sync <a href={`/sync/${createdSyncId}`}>{name}</a> created.
				</div>
			)}
		</section>
	)
}
