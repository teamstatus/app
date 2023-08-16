import { useAuth } from '#context/Auth.js'
import {
	HelpIcon,
	LogoutIcon,
	SyncsIcon,
	LogInIcon,
	UserIcon,
	HomeIcon,
	OrganizationIcon,
} from '#components/Icons.js'
import { linkUrl } from '#util/link.js'

export const AppNavigation = ({ onClick }: { onClick?: () => unknown }) => {
	const { user, logout } = useAuth()

	const onboarding =
		new URLSearchParams(document.location.search).get('onboarding') ?? undefined

	return (
		<nav class="d-flex flex-column align-items-start">
			{user && (
				<>
					{user.id !== undefined && (
						<>
							<a
								href={linkUrl(['syncs'], { onboarding })}
								class="btn btn-link text-body text-decoration-none"
								onClick={onClick}
							>
								<SyncsIcon /> <span class="ms-2">Syncs</span>
							</a>
							<a
								href={linkUrl(['organizations'], { onboarding })}
								class="btn btn-link text-body text-decoration-none"
								onClick={onClick}
							>
								<OrganizationIcon /> <span class="ms-2">Organizations</span>
							</a>
						</>
					)}
					<hr class={'w-100'} />
					<Home onClick={onClick} onboarding={onboarding} />
					<Help onClick={onClick} onboarding={onboarding} />
					<hr class={'w-100'} />
					<a
						href={linkUrl(['user'], { onboarding })}
						class="btn btn-link text-body text-decoration-none"
						onClick={onClick}
					>
						<UserIcon />
						<span class="ms-2">Profile</span>
					</a>
					<button
						type="button"
						onClick={() => {
							logout()
							onClick?.()
						}}
						class="btn btn-link text-body text-decoration-none"
					>
						<LogoutIcon />
						<span class="ms-2">Log out</span>
					</button>
				</>
			)}
			{!user && (
				<>
					<a
						href={linkUrl(['login'], { onboarding })}
						class="btn btn-link text-body text-decoration-none"
						onClick={onClick}
					>
						<LogInIcon />
						<span class="ms-2">Log in</span>
					</a>
					<hr class={'w-100'} />
					<Home onClick={onClick} onboarding={onboarding} />
					<Help onClick={onClick} onboarding={onboarding} />
				</>
			)}
		</nav>
	)
}

const Home = ({
	onClick,
	onboarding,
}: {
	onboarding?: string
	onClick?: () => unknown
}) => (
	<a
		href={linkUrl([''], { onboarding })}
		class="btn btn-link text-body text-decoration-none"
		onClick={onClick}
	>
		<HomeIcon />
		<span class="ms-2">Home</span>
	</a>
)

const Help = ({
	onClick,
	onboarding,
}: {
	onboarding?: string
	onClick?: () => unknown
}) => (
	<a
		href={linkUrl(['help'], { onboarding })}
		class="btn btn-link text-body text-decoration-none"
		onClick={onClick}
	>
		<HelpIcon />
		<span class="ms-2">Help</span>
	</a>
)
