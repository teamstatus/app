import { AsHeadline } from '#components/HeadlineFont.js'
import { AddIcon, ApplyIcon } from '#components/Icons.js'
import { OnboardingInfo } from '#views/OnboardingInfo.js'
import { PlusCircle } from 'lucide-preact'

export const SyncOnboarding = ({
	step,
}: {
	step?: 'create_sync' | 'sync_created'
}) => (
	<OnboardingInfo>
		<h2 class="mb-3">
			Getting started: <AsHeadline>Sync</AsHeadline>
		</h2>
		{step === 'sync_created' && (
			<>
				<p>Awesome! </p>
				<p>Now follow the link to check out the sync.</p>
			</>
		)}
		{step === 'create_sync' && (
			<>
				<p>
					In order to create a new <AsHeadline>sync</AsHeadline>, select one or
					more projects.
				</p>
				<p>
					You can also define the time span for which project status should be
					included in the <AsHeadline>sync</AsHeadline>.
				</p>
				<p>
					For example for a weekly <AsHeadline>sync</AsHeadline> on Tuesday at
					1000, you would set the start date to <em>last week's</em> Tuesday
					1000 and the end date to
					<em>this week's</em> Tuesday.
				</p>
				<p>
					Click the <ApplyIcon /> button to preview which status are included in
					the <AsHeadline>sync</AsHeadline>.
				</p>
				<p>
					For now, select your project and provide a name for the sync. Then
					click the <AddIcon /> button to save the <AsHeadline>sync</AsHeadline>
					.
				</p>
			</>
		)}
		{step === undefined && (
			<>
				<p>
					A <AsHeadline>sync</AsHeadline> is represents a meeting with
					stakeholders. It can be about one or more projects and should be
					create some time before the meeting happens, so everyone can prepare
					for the sync.
				</p>
				<p>
					Click the <PlusCircle class="mx-1" /> in the bottom right corner to
					create one.
				</p>
			</>
		)}
	</OnboardingInfo>
)
