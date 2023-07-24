import { MembersIcon, OwnerIcon, WatcherIcon } from '#components/Icons.js'
import { Role } from '#context/Projects.js'

export const RolePill = ({
	role,
	class: c,
}: {
	role: Role
	class?: string
}) => (
	<>
		{role === Role.OWNER && (
			<span
				class={`${c} badge rounded-pill text-dark`}
				style={{ backgroundColor: '#FFD926' }}
			>
				<OwnerIcon size={10} /> Owner
			</span>
		)}
		{role === Role.MEMBER && (
			<span
				class={`${c} badge rounded-pill text-dark`}
				style={{ backgroundColor: '#73DCFF' }}
			>
				<MembersIcon size={10} /> Member
			</span>
		)}
		{role === Role.WATCHER && (
			<span
				class={`${c} badge rounded-pill text-dark`}
				style={{ backgroundColor: '#CCC' }}
			>
				<WatcherIcon size={10} /> Watcher
			</span>
		)}
	</>
)
