import { useEffect } from 'preact/hooks'
import { navigateTo } from '#util/link'

export const IDOnboardingRedirect = ({ redirect }: { redirect: string }) => {
	useEffect(() => {
		console.debug(`Redirecting to /id`)
		navigateTo(['id'], { redirect })
	}, [])

	return <main>Redirecting to ID selection...</main>
}
