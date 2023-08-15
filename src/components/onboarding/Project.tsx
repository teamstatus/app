import { AsHeadline } from '#components/HeadlineFont.js'
import { useProjects, type Organization } from '#context/Projects.js'
import { OnboardingInfo } from '#views/OnboardingInfo.js'
import { PlusCircle } from 'lucide-preact'

export const ProjectOnboarding = ({
	organization,
}: {
	organization: Organization
}) => {
	const { projects } = useProjects()
	const orgProjects = Object.values(projects)
		.filter((project) => project.organizationId === organization.id)
		.sort(({ id: id1 }, { id: id2 }) => id1.localeCompare(id2))

	return (
		<OnboardingInfo>
			<h2 class="mb-3">
				Getting started: <AsHeadline>Projects</AsHeadline>
			</h2>
			<p>Within an organization, there can be multiple projects.</p>
			<p>
				Click the <PlusCircle class="mx-1" /> in the bottom right corner to
				create one.
			</p>
			{orgProjects.length > 0 && (
				<p>
					Or, because you already have projects you can also pick an existing
					one below.
				</p>
			)}
		</OnboardingInfo>
	)
}
