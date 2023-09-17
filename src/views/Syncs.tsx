import { useSyncs } from '#context/Syncs.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { Main } from '#components/Main.js'
import { SyncIcon } from '#components/Icons.js'
import { SyncOnboarding } from '#components/onboarding/Sync.js'
import { linkUrl } from '#util/link.js'
import { SyncView } from '#components/SyncView'

export const Syncs = ({ onboarding }: { onboarding?: string }) => {
	const { syncs } = useSyncs()
	const syncItems = Object.values(syncs)
	const showOnboardingInfo = onboarding !== undefined

	return (
		<>
			<LogoHeader />
			{showOnboardingInfo && <SyncOnboarding />}
			<Main class="container">
				<div class="row mt-3">
					<div class="col-12 col-lg-8 offset-lg-2">
						<section>
							<div class="d-flex justify-content-between align-items-center">
								<h1>Syncs</h1>
								<SyncIcon />
							</div>
							{syncItems.length === 0 && (
								<>
									<p>You have no syncs,yet.</p>
									<p>
										Why don't you{' '}
										<a href={linkUrl(['sync', 'create'], { onboarding })}>
											create a new sync
										</a>{' '}
										right now?
									</p>
								</>
							)}
							{syncItems.length > 0 &&
								syncItems.map((sync) => (
									<SyncView sync={sync} onboarding={onboarding} />
								))}
						</section>
					</div>
				</div>
			</Main>
			<ProjectMenu
				actions={[{ href: linkUrl(['sync', 'create'], { onboarding }) }]}
			/>
		</>
	)
}
