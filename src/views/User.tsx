import { useAuth } from '../context/Auth.js'

export const User = () => {
	const { user } = useAuth()
	if (user === undefined) return null
	return (
		<main class="container">
			<h1>User</h1>
			<dl>
				<dt>Email</dt>
				<dd>{user.email}</dd>
				<dt>ID</dt>
				<dd>{user.id}</dd>
			</dl>
		</main>
	)
}
