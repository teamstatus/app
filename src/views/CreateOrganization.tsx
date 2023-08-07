import { CreateOrganization as CreateForm } from '#components/CreateOrganization.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { Main } from '#components/Main.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { route } from 'preact-router'

export const CreateOrganization = () => (
	<>
		<LogoHeader />
		<Main class="container">
			<div class="col-md-8 offset-md-2 col-lg-6 offset-lg-3 mt-4">
				<section>
					<h1>Create a new organization</h1>
					<CreateForm
						onOrganization={() => {
							route(`/organizations`)
						}}
					/>
				</section>
			</div>
		</Main>
		<ProjectMenu />
	</>
)
