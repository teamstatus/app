import { CreateOrganization as CreateForm } from '#components/CreateOrganization.tsx'
import { FormContainer } from '#components/FormContainer.tsx'
import { LogoHeader } from '#components/LogoHeader.tsx'
import { Main } from '#components/Main.tsx'
import { navigateTo } from '#util/link.ts'

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
