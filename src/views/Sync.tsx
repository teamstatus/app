import cx from 'classnames'
import { route } from 'preact-router'
import { useState } from 'preact/hooks'
import { NextIcon } from '../components/Icons.js'
import { useProjects } from '../context/Projects.js'

export const Sync = () => {
	const { projects } = useProjects()
	const [selectedProjects, updateSelectedProjects] = useState<string[]>([])
	const isValid = selectedProjects.length > 0
	return (
		<main class="container">
			<div class="row mt-3">
				<div class="col">
					<div class="card">
						<div class="card-header">
							<h1>Select projects for a sync</h1>
						</div>
						<div class="card-body">
							{Object.values(projects)
								.sort((a, b) => a.id.localeCompare(b.id))
								.map((project) => (
									<div class="form-check">
										<label htmlFor={project.id}>
											<input
												class="form-check-input"
												type="checkbox"
												id={project.id}
												onClick={() => {
													updateSelectedProjects((projects) =>
														projects.includes(project.id)
															? projects.filter((id) => id !== project.id)
															: [...projects, project.id],
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
									<div class="col">
										<p>You have no projects,yet.</p>
										<p>
											<a href="/project/create">Create a new project</a>, or ask
											to be invited to an existing one.
										</p>
									</div>
								</div>
							)}
						</div>
						<div class="card-footer d-flex align-items-center justify-content-end">
							<button
								class={cx('btn', {
									'btn-primary': isValid,
									'btn-secondary': !isValid,
								})}
								disabled={!isValid}
								onClick={() => {
									route(
										`/sync/create?${new URLSearchParams({
											projects: selectedProjects.join(','),
										}).toString()}`,
									)
								}}
							>
								<NextIcon />
							</button>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
