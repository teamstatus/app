import { CreateStatus as CreateForm } from '#components/CreateStatus.tsx'
import { FormContainer } from '#components/FormContainer.tsx'
import { Main } from '#components/Main.tsx'
import { NotFound } from '#components/NotFound.tsx'
import { ProjectHeader } from '#components/ProjectHeader.tsx'
import { StatusOnboarding } from '#components/onboarding/Status.tsx'
import { useProjects } from '#context/Projects.tsx'
import { navigateTo } from '#util/link.ts'

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
				<div class="col-12 col-lg-8 offset-lg-2">
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
