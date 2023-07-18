import { useEffect } from 'preact/hooks'
import { route } from 'preact-router'

export const LoginRedirect = ({ redirect }: { redirect?: string }) => {
	useEffect(() => {
		if (redirect === undefined) return
		console.debug(`Redirecting to`, redirect)
		route(redirect)
	}, [redirect])

	return <main>Redirecting to {redirect}...</main>
}
