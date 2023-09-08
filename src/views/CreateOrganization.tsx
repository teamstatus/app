import { CreateOrganization as CreateForm } from '#components/CreateOrganization.js'
import { FormContainer } from '#components/FormContainer.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { Main } from '#components/Main.js'
import { navigateTo } from '#util/link.js'

export const CreateOrganization = ({ onboarding }: { onboarding?: string }) => (
	<>
		<LogoHeader />
		<div class="container">
			<div class="row">
				<div class="col-12 col-lg-8 offset-lg-2">
					<Main>
						<FormContainer
							header={<h1>Create a new organization</h1>}
							class="mt-sm-4"
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
	</>
)
