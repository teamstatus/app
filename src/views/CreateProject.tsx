import { CreateProject as CreateForm } from '#components/CreateProject.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { Main } from '#components/Main.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { type Organization } from '#context/Projects.js'
import { route } from 'preact-router'

export const CreateProject = ({
	organization,
}: {
	organization?: Organization
}) => (
	<>
		<LogoHeader />
		<Main class="container">
			<div class="col-md-8 offset-md-2 col-lg-6 offset-lg-3 mt-4">
				<section>
					<h1>Create a new project</h1>
					<CreateForm
						organization={organization}
						onProject={() => {
							route(`/projects`)
						}}
					/>
				</section>
			</div>
		</Main>
		<ProjectMenu />
	</>
)
