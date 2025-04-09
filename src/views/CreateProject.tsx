import { CreateProject as CreateForm } from '#components/CreateProject.tsx'
import { FormContainer } from '#components/FormContainer.tsx'
import { LogoHeader } from '#components/LogoHeader.tsx'
import { Main } from '#components/Main.tsx'
import { navigateTo } from '#util/link.ts'

export const CreateProject = ({
	organization,
	onboarding,
}: {
	organization: string
	onboarding?: string
}) => {
	return (
		<>
			<LogoHeader />
			<Main class="container">
				<div class="col-12 col-lg-8 offset-lg-2 mt-sm-4">
					<FormContainer header={<h1>Create a new project</h1>}>
						<CreateForm
							organizationId={organization}
							onProject={(project) => {
								navigateTo(['project', project.id], { onboarding })
							}}
						/>
					</FormContainer>
				</div>
			</Main>
		</>
	)
}
