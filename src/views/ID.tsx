import { LogoHeader } from '#components/LogoHeader.js'
import { PickID } from '#components/PickID.js'

export const ID = ({ redirect }: { redirect: string }) => {
	return (
		<>
			<LogoHeader animated />
			<PickID redirect={redirect} />
		</>
	)
}
