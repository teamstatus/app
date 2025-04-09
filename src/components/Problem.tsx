import { LogoHeader } from '#components/LogoHeader.tsx'
import type { ProblemDetail } from '#context/ProblemDetail.tsx'
import { ProjectMenu } from '#components/ProjectMenu.tsx'
import { Main } from '#components/Main.tsx'

export const Problem = ({ problem }: { problem: ProblemDetail }) => (
	<>
		<LogoHeader />
		<Main class="container">
			<div class="row mt-3">
				<div class="col-12 col-lg-8 offset-lg-2">
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
