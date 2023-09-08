import { LogoHeader } from '#components/LogoHeader.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { Main } from '#components/Main.js'
import type { ComponentChild } from 'preact'

export const NotFound = ({ children }: { children: ComponentChild }) => (
	<>
		<LogoHeader />
		<Main class="container">
			<div class="row mt-3">
				<div class="col-12 col-lg-8 offset-lg-2">
					<div class="alert alert-danger" role="alert">
						{children}
					</div>
				</div>
			</div>
		</Main>
		<ProjectMenu />
	</>
)
