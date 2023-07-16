import { useAuth } from '../context/Auth.js'
import {
	HelpIcon,
	LogoutIcon,
	ProjectsIcon,
	SyncsIcon,
	LogInIcon,
	UserIcon,
} from '../components/Icons.js'

export const AppNavigation = ({ onClick }: { onClick?: () => unknown }) => {
	const { user, logout } = useAuth()

	return (
		<nav class="d-flex flex-column align-items-start">
			{user && (
				<>
					{user.id !== undefined && (
						<>
							<a
								href="/projects"
								class="btn btn-link text-body text-decoration-none"
								onClick={onClick}
							>
								<ProjectsIcon /> <span class="ms-2">Projects</span>
							</a>
							<a
								href="/syncs"
								class="btn btn-link text-body text-decoration-none"
								onClick={onClick}
							>
								<SyncsIcon /> <span class="ms-2">Syncs</span>
							</a>
						</>
					)}
					<a
						href="/"
						class="btn btn-link text-body text-decoration-none"
						onClick={onClick}
					>
						<HelpIcon />
						<span class="ms-2">Help</span>
					</a>
					<a
						href="/user"
						class="btn btn-link text-body text-decoration-none"
						onClick={onClick}
					>
						<UserIcon />
						<span class="ms-2">Profile</span>
					</a>
					<hr class={'w-100'} />
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
						href="/login"
						class="btn btn-link text-body text-decoration-none"
						onClick={onClick}
					>
						<LogInIcon />
						<span class="ms-2">Log in</span>
					</a>
				</>
			)}
		</nav>
	)
}
