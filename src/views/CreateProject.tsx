import { CreateProject as CreateForm } from '#components/CreateProject.js'
import { FormContainer } from '#components/FormContainer.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { Main } from '#components/Main.js'
import { navigateTo } from '#util/link.js'

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
