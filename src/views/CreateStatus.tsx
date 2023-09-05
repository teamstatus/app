import { CreateStatus as CreateForm } from '#components/CreateStatus.js'
import { FormContainer } from '#components/FormContainer.js'
import { Main } from '#components/Main.js'
import { NotFound } from '#components/NotFound.js'
import { ProjectHeader } from '#components/ProjectHeader.js'
import { StatusOnboarding } from '#components/onboarding/Status.js'
import { useProjects } from '#context/Projects.js'
import { navigateTo } from '#util/link.js'

export const CreateStatus = ({
	id,
	onboarding,
}: {
	id: string // e.g. '$teamstatus#development'
	onboarding?: string
}) => {
	const { projects } = useProjects()
	const showOnboardingInfo = onboarding !== undefined

	const project = projects[id]
	if (project === undefined) {
		return <NotFound>Project not found: {id}</NotFound>
	}

	return (
		<>
			<ProjectHeader project={project} />
			{showOnboardingInfo && (
				<StatusOnboarding project={project} step={'create_status'} />
			)}
			<Main class="container mt-sm-4">
				<div class="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
					<FormContainer header={<h1>Create a new status</h1>}>
						<CreateForm
							project={project}
							onStatus={(status) => {
								navigateTo(['project', id], { onboarding, newStatus: status })
							}}
						/>
					</FormContainer>
				</div>
			</Main>
		</>
	)
}
