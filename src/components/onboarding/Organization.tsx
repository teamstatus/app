import { AsHeadline } from '#components/HeadlineFont.js'
import { useProjects } from '#context/Projects.js'
import { OnboardingInfo } from '#views/OnboardingInfo.js'
import { PlusCircle } from 'lucide-preact'

export const OrganizationOnboarding = () => {
	const { organizations } = useProjects()
	return (
		<OnboardingInfo>
			<h2 class="mb-3">
				Getting started: <AsHeadline>Organizations</AsHeadline>
			</h2>
			<p>
				In <AsHeadline>teamstatus.space</AsHeadline> everything centers around
				sharing what happened in a project using a <AsHeadline>sync</AsHeadline>
				, which is a meeting where multiple project members come together to
				share about what happened in the project since the last sync.
			</p>
			<p>
				Before you can share your first status in a sync, we need a{' '}
				<AsHeadline>project</AsHeadline> that this status belongs to.
			</p>
			<p>
				And projects belong to <AsHeadline>organizations</AsHeadline>.
			</p>
			<p>
				So let's start by creating an organization: Click the{' '}
				<PlusCircle class="mx-1" /> in the bottom right corner to create one.
			</p>
			{organizations.length > 0 && (
				<p>
					Or, since you already have projects you can also pick an existing one
					below.
				</p>
			)}
		</OnboardingInfo>
	)
}
