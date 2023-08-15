import { CreateOrganization as CreateForm } from '#components/CreateOrganization.js'
import { FormContainer } from '#components/FormContainer.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { Main } from '#components/Main.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { navigateTo } from '#util/link.js'

export const CreateOrganization = ({ onboarding }: { onboarding?: string }) => (
	<>
		<LogoHeader />
		<div class="container mt-lg-4">
			<div class="row">
				<div class="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
					<Main>
						<FormContainer
							header={<h1>Create a new organization</h1>}
							class="mt-4"
						>
							<CreateForm
								onOrganization={(organization) => {
									navigateTo(['organization', organization.id], { onboarding })
								}}
							/>
						</FormContainer>
					</Main>
				</div>
			</div>
		</div>
		<ProjectMenu />
	</>
)
