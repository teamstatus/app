import { useProjects } from '#context/Projects.js'
import { OnboardingInfo } from '#views/OnboardingInfo.js'
import { PlusCircle } from 'lucide-preact'

export const OrganizationOnboarding = () => {
	const { organizations } = useProjects()
	return (
		<OnboardingInfo>
			<p>
				Click the <PlusCircle class="mx-1" /> in the bottom right corner to
				create one.
			</p>
			{organizations.length > 0 && (
				<p>
					Or, because you already have projects you can also pick an existing
					one below.
				</p>
			)}
		</OnboardingInfo>
	)
}
