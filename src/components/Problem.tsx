import { LogoHeader } from '#components/LogoHeader.js'
import { type ProblemDetail } from '#context/ProblemDetail.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { Main } from '#components/Main.js'

export const Problem = ({ problem }: { problem: ProblemDetail }) => (
	<>
		<LogoHeader />
		<Main class="container">
			<div class="row mt-3">
				<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
					<div class="alert alert-danger" role="alert">
						{problem.title} ({problem.status})
						{problem.detail !== undefined && (
							<>
								<br />
								{problem.detail}
							</>
						)}
					</div>
				</div>
			</div>
		</Main>
		<ProjectMenu />
	</>
)
