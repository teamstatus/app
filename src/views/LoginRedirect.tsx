import { useEffect } from 'preact/hooks'
import { route } from 'preact-router'

export const LoginRedirect = ({ redirect }: { redirect?: string }) => {
	useEffect(() => {
		console.debug(`Redirecting to`, redirect ?? '/')
		route(redirect ?? '/')
	}, [redirect])

	return <main>Redirecting to {redirect}...</main>
}
