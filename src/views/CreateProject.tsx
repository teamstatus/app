import { ChevronLeft } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { useProjects } from '../context/Projects.js'

export const CreateProject = () => {
	//const [id, setId] = useState<string>('')
	//const [name, setName] = useState<string>('')
	const [organizationId, setOrganization] = useState<string | undefined>()
	const { projects } = useProjects()
	const [error, _ /*setError*/] = useState<string | undefined>()

	const organizations = [
		...new Set(Object.values(projects).map(({ organization: { id } }) => id)),
	]

	//const isValid = isProjectId(`${organizationId}#${id}`)
	return (
		<>
			<main class="container">
				<div class="card mt-2">
					<div class="card-header">
						<h1>Create a new project</h1>
					</div>
					<div class="card-body">
						{error !== undefined && (
							<div class="alert alert-danger" role="alert">
								An error occured ({error})!
							</div>
						)}
						<div class="mb-3">
							<label for="organization" class="form-label">
								Organization
							</label>
							<select
								class="form-select"
								aria-label="Default select example"
								id="organization"
								value={organizationId}
								onChange={(e) =>
									setOrganization((e.target as HTMLSelectElement).value)
								}
							>
								{organizations.map((id) => (
									<option value={id}>{id}</option>
								))}
							</select>
						</div>
					</div>
					<div class="card-footer d-flex align-items-center justify-content-between">
						<a href={`/projects/`} class="btn btn-outline-danger">
							<ChevronLeft />
						</a>
					</div>
				</div>
			</main>
		</>
	)
}
