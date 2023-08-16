import { AsHeadline } from '#components/HeadlineFont.js'
import { UpdateIcon } from '#components/Icons.js'
import {
	ReactionView,
	newVersionRelease,
	question,
} from '#components/Reactions.js'
import { type Project } from '#context/Projects.js'
import { ReactionRole, useStatus, type Status } from '#context/Status.js'
import { OnboardingInfo } from '#views/OnboardingInfo.js'
import { PlusCircle, PlusIcon, SmilePlus } from 'lucide-preact'

const byReaction =
	(role: ReactionRole) =>
	({ reactions }: Status) =>
		reactions.find(
			(reaction) => 'role' in reaction && reaction.role === role,
		) !== undefined

export const StatusOnboarding = ({
	project,
	step,
}: {
	project: Project
	step?: 'create_status'
}) => {
	const { projectStatus } = useStatus()
	const status = projectStatus[project.id] ?? []
	const hasSignificant =
		status.find(byReaction(ReactionRole.SIGNIFICANT)) !== undefined
	const hasQuestion =
		status.find(byReaction(ReactionRole.QUESTION)) !== undefined

	return (
		<OnboardingInfo>
			<h2 class="mb-3">
				Getting started: <AsHeadline>Status</AsHeadline>
			</h2>

			{step === undefined && (
				<>
					<p>
						<AsHeadline>Status</AsHeadline> keep track of what's happening in a
						project. You will most likely publish multiple of them per day.
					</p>
					{status.length === 0 && (
						<>
							<p>
								Now it's time to create your first{' '}
								<AsHeadline>status</AsHeadline>!
							</p>
							<p>
								Click the <PlusCircle class="mx-1" /> in the bottom right corner
								to create one.
							</p>
						</>
					)}
					{status.length > 0 && (
						<p class="text-secondary mb-0">
							<del>
								<UpdateIcon size={16} class="me-1" />
								Create your first status.
							</del>
						</p>
					)}

					{status.length === 1 && (
						<>
							<p class="mt-3">
								Great! Let's create another status.
								<br />
								How about you try formatting the message with Markdown?
							</p>
						</>
					)}
					{status.length > 1 && (
						<p class="text-secondary mb-0">
							<del>
								<UpdateIcon size={16} class="me-1" />
								Create your second status.
							</del>
						</p>
					)}

					{status.length === 2 && (
						<p class="mt-3">
							Finally, create a third status, so we can see the difference{' '}
							<AsHeadline>reactions</AsHeadline> play.
						</p>
					)}
					{status.length > 2 && (
						<p class="text-secondary mb-0">
							<del>
								<UpdateIcon size={16} class="me-1" />
								Create your third status.
							</del>
						</p>
					)}

					{status.length > 2 && !hasSignificant && (
						<>
							<p class="mt-3">
								Add a <AsHeadline>Reaction</AsHeadline> to one status, that
								marks this status as <AsHeadline>significant</AsHeadline>. This
								is a way to make a status stand out in a{' '}
								<AsHeadline>sync</AsHeadline>.
							</p>
							<p>
								Click the <SmilePlus class="mx-1" strokeWidth={1} /> and select
								the <ReactionView reaction={newVersionRelease} class="mx-1" />{' '}
								<AsHeadline>reaction</AsHeadline> on one of the status.
							</p>
						</>
					)}
					{hasSignificant && (
						<p class="text-secondary mb-0">
							<del>
								<UpdateIcon size={16} class="me-1" />
								Add a significant reaction.
							</del>
						</p>
					)}

					{status.length > 2 && hasSignificant && !hasQuestion && (
						<>
							<p class="mt-3">
								Add a <AsHeadline>Reaction</AsHeadline> to one status, that
								marks this status as a <AsHeadline>question</AsHeadline>.
							</p>
							<p>
								Every member of a project can add this reaction to a status, so
								it is a great way for you to earmark a status as to be discussed
								during the next sync.
							</p>
							<p>
								In a <AsHeadline>sync</AsHeadline>, status that have the
								question reaction will be shown separately at the top so they
								can be discussed during the sync.
							</p>
							<p>
								Click the <SmilePlus class="mx-1" strokeWidth={1} /> and select
								the <ReactionView reaction={question} class="mx-1" />{' '}
								<AsHeadline>reaction</AsHeadline>.
							</p>
						</>
					)}
					{hasQuestion && (
						<p class="text-secondary mb-0">
							<del>
								<UpdateIcon size={16} class="me-1" />
								Add a question reaction.
							</del>
						</p>
					)}

					{status.length > 2 && hasSignificant && hasQuestion && (
						<>
							<p class="mt-3">Awesome!</p>
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
							it. No worries, you can always edit or delete a status later.
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
