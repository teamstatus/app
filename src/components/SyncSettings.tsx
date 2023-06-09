import cx from 'classnames'
import { route } from 'preact-router'
import { useState } from 'preact/hooks'
import { type Project } from '../context/Projects.js'
import { useSyncs } from '../context/Syncs.js'
import { ApplyIcon, BackIcon, NextIcon } from './Icons.js'

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
	const defaultSyncName = `Sync ${new Date().toISOString().slice(0, 10)}`
	const [name, setName] = useState(defaultSyncName)

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
		(startDate?.getTime() ?? -Number.MIN_SAFE_INTEGER) <
			(endDate?.getTime() ?? Number.MIN_SAFE_INTEGER)

	return (
		<div class="card">
			<div class="card-header">
				<h2>Projects in the sync</h2>
			</div>
			<div class="card-body">
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
							onInput={(e) =>
								setStartTime((e.target as HTMLInputElement).value)
							}
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
						placeholder={`e.g. "${defaultSyncName}"`}
						value={name}
						onInput={(e) => setName((e.target as HTMLInputElement).value)}
					/>
				</div>
			</div>
			<div class="card-footer d-flex align-items-center justify-content-between">
				<span>
					<a href={`/`} class="btn btn-outline-secondary">
						<BackIcon />
					</a>
					<button
						class={'btn btn-secondary ms-1'}
						onClick={() => {
							onUpdate(selectedProjects, startDate, endDate)
						}}
					>
						<ApplyIcon />
					</button>
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
							if ('id' in res) route(`/sync/${res.id}`)
						}}
					>
						<NextIcon />
					</button>
				</span>
			</div>
		</div>
	)
}
