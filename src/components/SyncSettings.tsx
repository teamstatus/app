import { useState } from 'preact/hooks'
import { type Project } from '../context/Projects.js'
import { ApplyIcon, BackIcon } from './Icons.js'

export const SyncSettings = ({
	projects,
	onUpdate,
}: {
	projects: Project[]
	onUpdate: (selectedProjects: string[], startDate?: Date) => void
}) => {
	const [startDay, setStartDay] = useState('') // '2023-06-11'
	const [startTime, setStartTime] = useState('00:00') // '00:35'
	const [selectedProjects, setSelectedProjects] = useState<string[]>([])

	const startDate =
		startDay.length > 0 && startTime.length > 0
			? new Date(`${startDay}T${startTime}:00`)
			: undefined

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
					<div class="row">
						<div class="col-12 col-md-6 offset-md-3">
							<p>You have no projects,yet.</p>
							<p>
								<a href="/project/create">Create a new project</a>, or ask to be
								invited to an existing one.
							</p>
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
							onInput={(e) =>
								setStartTime((e.target as HTMLInputElement).value)
							}
						/>
					</div>
				</div>
			</div>
			<div class="card-footer d-flex align-items-center justify-content-between">
				<a href={`/`} class="btn btn-outline-secondary">
					<BackIcon />
				</a>
				<button
					class={'btn btn-secondary'}
					onClick={() => {
						onUpdate(selectedProjects, startDate)
					}}
				>
					<ApplyIcon />
				</button>
			</div>
		</div>
	)
}
