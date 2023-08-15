import { AsHeadline } from '#components/HeadlineFont.js'
import { ReactionView, newVersionRelease } from '#components/Reactions.js'
import { type Project } from '#context/Projects.js'
import { ReactionRole, useStatus } from '#context/Status.js'
import { OnboardingInfo } from '#views/OnboardingInfo.js'
import { PlusCircle, PlusIcon, SmilePlus } from 'lucide-preact'

export const StatusOnboarding = ({
	project,
	step,
}: {
	project: Project
	step?: 'create_status'
}) => {
	const { projectStatus } = useStatus()
	const status = projectStatus[project.id] ?? []
	const hasStatusWithSignificantReaction =
		status.find(
			({ reactions }) =>
				reactions.find(
					(reaction) =>
						'role' in reaction && reaction.role === ReactionRole.SIGNIFICANT,
				) !== undefined,
		) !== undefined

	return (
		<OnboardingInfo>
			<h2 class="mb-3">
				Getting started: <AsHeadline>Status</AsHeadline>
			</h2>

			{step === undefined && (
				<>
					{status.length === 0 && (
						<>
							<p>Now it's time to create your first status!</p>
							<p>
								Click the <PlusCircle class="mx-1" /> in the bottom right corner
								to create one.
							</p>
						</>
					)}

					{status.length === 1 && (
						<>
							<p>Great! Let's create another status.</p>
							<p>
								And once you've done that, add a{' '}
								<AsHeadline>Reaction</AsHeadline> that marks this status as{' '}
								<AsHeadline>significant</AsHeadline>.
							</p>
						</>
					)}

					{status.length > 1 && !hasStatusWithSignificantReaction && (
						<>
							<p>
								Add a <AsHeadline>Reaction</AsHeadline> to one status, that
								marks this status as <AsHeadline>significant</AsHeadline>.
							</p>
							<p>
								Click the <SmilePlus class="mx-1" strokeWidth={1} /> and select
								the <ReactionView reaction={newVersionRelease} class="mx-1" />{' '}
								<AsHeadline>reaction</AsHeadline>.
							</p>
						</>
					)}

					{status.length > 1 && hasStatusWithSignificantReaction && (
						<>
							<p>Awesome!</p>
							<p>
								Now it's time to create your first <AsHeadline>sync</AsHeadline>
								.
							</p>
							<p>
								Select <AsHeadline>Syncs</AsHeadline> from the menu in the top
								right.
							</p>
						</>
					)}
				</>
			)}

			{step === 'create_status' && (
				<>
					{status.length === 0 && (
						<p>
							Let's create a regular status update. Describe what you did for
							this project today. Click the <PlusIcon class="mx-1" /> to save
							it. No worries, you can always edit or delete status.
						</p>
					)}
					{status.length > 0 && (
						<p>You can keep adding more status if you like.</p>
					)}
				</>
			)}
		</OnboardingInfo>
	)
}
