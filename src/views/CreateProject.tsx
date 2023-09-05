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
				<div class="col-md-8 offset-md-2 col-lg-6 offset-lg-3 mt-sm-4">
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
