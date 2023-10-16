import { decodeTime } from 'ulid'
import { type Sync, useSyncs } from '#context/Syncs.js'
import { DeleteIcon } from '#components/Icons.js'
import { ShortDate } from '#components/ShortDate.js'
import { EditMenu } from '#components/EditMenu.js'
import { linkUrl } from '#util/link.js'
import { useAuth } from '#context/Auth'
import { ProjectId } from './ProjectId'
import { useState } from 'preact/hooks'
import { CopyIcon } from 'lucide-preact'

export const SyncView = ({
	sync,
	onboarding,
}: { sync: Sync; onboarding?: string }) => {
	const ts = new Date(decodeTime(sync.id))
	const { deleteSync } = useSyncs()
	const { user } = useAuth()
	const [projectsCollapsed, setProjectsCollapsed] = useState<boolean>(true)

	return (
		<>
			<div
				class="my-2 d-flex justify-content-between align-items-center"
				key={sync.id}
			>
				<div>
					<small class="text-muted">
						<ShortDate date={ts} />
						<span class="ms-1 me-1">&middot;</span>
						{projectsCollapsed && (
							<abbr
								onClick={() => setProjectsCollapsed((c) => !c)}
								title={sync.projectIds.join(', ')}
							>
								{sync.projectIds.length} project(s)
							</abbr>
						)}
						{!projectsCollapsed && (
							<span onClick={() => setProjectsCollapsed((c) => !c)}>
								{sync.projectIds.map((id, idx, arr) => (
									<>
										<ProjectId id={id} />
										{idx < arr.length - 1 && (
											<span class="ms-1 me-1">&middot;</span>
										)}
									</>
								))}
							</span>
						)}
					</small>
					<br />
					<a href={linkUrl(['sync', sync.id], { onboarding })}>{sync.title}</a>
				</div>

				<EditMenu>
					{sync.owner === user?.id && (
						<button
							type="button"
							class="btn btn-sm btn-outline-danger me-1"
							onClick={() => {
								deleteSync(sync)
							}}
						>
							<DeleteIcon size={18} />
						</button>
					)}
					<a
						class="btn btn-sm btn-outline-secondary me-1"
						href={linkUrl(['sync', 'create'], {
							onboarding,
							'sync:title': sync.title,
							'sync:projectIds': sync.projectIds.join(','),
							'sync:start': sync.inclusiveStartDate?.toISOString(),
							'sync:end': sync.inclusiveEndDate?.toISOString(),
						})}
					>
						<CopyIcon size={18} />
					</a>
				</EditMenu>
			</div>
			<hr />
		</>
	)
}
