import cx from 'classnames'
import { useState } from 'preact/hooks'
import { useProjects, type Project } from '#context/Projects.js'
import { useSyncs } from '#context/Syncs.js'
import { AddIcon, ApplyIcon, DownIcon } from './Icons.js'
import { format } from 'date-fns-tz'
import { addMilliseconds } from 'date-fns'

export const SyncSettings = ({
	projects,
	onUpdate,
	onCreated,
}: {
	projects: Project[]
	onUpdate: (
		selectedProjects: string[],
		startDate?: Date,
		endDate?: Date,
	) => void
	onCreated: (syncId: string) => void
}) => {
	const search = new URLSearchParams(document.location.search)
	const prefill = {
		title: search.get('sync:title'),
		selectedProjects: search.get('sync:projectIds')?.split(',') ?? [],
		start: search.get('sync:start'),
		end: search.get('sync:end'),
	}

	let maybePrefilledStart: Date | undefined = undefined
	if (prefill.start !== null) {
		maybePrefilledStart = new Date(prefill.start)
	}

	let maybePrefilledEnd: Date | undefined = undefined
	if (prefill.end !== null) {
		maybePrefilledEnd = new Date(prefill.end)
	}

	let adjusted = false
	if (maybePrefilledStart !== undefined && maybePrefilledEnd !== undefined) {
		const delta = maybePrefilledEnd.getTime() - maybePrefilledStart.getTime()
		maybePrefilledStart = addMilliseconds(maybePrefilledStart, delta)
		maybePrefilledEnd = addMilliseconds(maybePrefilledEnd, delta)
		adjusted = true
	}

	const { addSync } = useSyncs()
	const { organizations } = useProjects()
	// FIXME: format to local ISO date
	const [startDay, setStartDay] = useState(
		maybePrefilledStart !== undefined
			? format(maybePrefilledStart, 'yyyy-MM-dd')
			: '',
	) // '2023-06-11'
	const [endDay, setEndDay] = useState(
		maybePrefilledEnd !== undefined
			? format(maybePrefilledEnd, 'yyyy-MM-dd')
			: '',
	) // '2023-06-11'
	const [startTime, setStartTime] = useState(
		maybePrefilledStart !== undefined
			? format(maybePrefilledStart, 'HH:mm')
			: '00:00',
	) // '00:35'
	const [endTime, setEndTime] = useState(
		maybePrefilledEnd !== undefined
			? format(maybePrefilledEnd, 'HH:mm')
			: '00:00',
	) // '00:35'
	const [selectedProjects, setSelectedProjects] = useState<string[]>(
		prefill?.selectedProjects ?? [],
	)
	const [name, setName] = useState(prefill?.title ?? '')

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

	const projectsByOrganization = projects.reduce<Record<string, Project[]>>(
		(byOrg, project) => {
			byOrg[project.organizationId] = [
				...(byOrg[project.organizationId] ?? []),
				project,
			]
			return byOrg
		},
		{},
	)

	return (
		<section>
			<label for="startDate" class="form-label">
				Project
			</label>
			{Object.entries(projectsByOrganization)
				.sort(([idA], [idB]) => idA.localeCompare(idB))
				.map(([organizationId, projects]) => {
					return (
						<section class="mb-2">
							<p class="mb-1">
								{organizations.find(({ id }) => id === organizationId)?.name ??
									organizationId}
							</p>
							{projects.length > 1 && (
								<p class="mb-1">
									<label title={'select all'}>
										<input
											type="checkbox"
											style={{ display: 'none' }}
											class="form-check-input"
											onInput={(e) => {
												const projectIds = projects.map(({ id }) => id)
												if ((e.target as HTMLInputElement).checked) {
													setSelectedProjects((p) => [
														...new Set([...p, ...projectIds]),
													])
												} else {
													setSelectedProjects((p) =>
														p.filter((id) => !projectIds.includes(id)),
													)
												}
											}}
										/>{' '}
										<span class="text-muted">
											<DownIcon /> select all
										</span>
									</label>
								</p>
							)}
							{projects.map((project) => {
								return (
									<div class="form-check ms-1">
										<label htmlFor={project.id}>
											<input
												class="form-check-input"
												type="checkbox"
												id={project.id}
												onClick={() => {
													setSelectedProjects((selectedProjects) =>
														selectedProjects.includes(project.id)
															? selectedProjects.filter(
																	(id) => id !== project.id,
															  )
															: [...selectedProjects, project.id],
													)
												}}
												checked={selectedProjects.includes(project.id)}
											/>
											{project.name ?? project.id}
										</label>
									</div>
								)
							})}
						</section>
					)
				})}
			{Object.values(projects).length === 0 && (
				<div>
					<p>You have no projects,yet.</p>
					<p>
						<a href="/project/create">Create a new project</a>, or ask to be
						invited to an existing one.
					</p>
				</div>
			)}
			{adjusted && (
				<div class={'row mt-3'}>
					<div class="col">
						<div class="alert alert-warning">
							Start and end date have been adjusted to the next period.
						</div>
					</div>
				</div>
			)}
			<div class={'row'}>
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
			<div class="d-flex align-items-center justify-content-end mt-4">
				<span>
					<button
						type="button"
						class={cx('btn', {
							'btn-primary': isValid,
							'btn-secondary': !isValid,
						})}
						disabled={!isValid}
						onClick={() => {
							const res = addSync(selectedProjects, name, startDate, endDate)
							if ('id' in res) onCreated(res.id)
						}}
					>
						<AddIcon />
					</button>
					<button
						type="button"
						class={'btn btn-secondary ms-1'}
						onClick={() => {
							onUpdate(selectedProjects, startDate, endDate)
						}}
					>
						<ApplyIcon />
					</button>
				</span>
			</div>
		</section>
	)
}
