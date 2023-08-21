import { LogoHeader } from '#components/LogoHeader.js'
import { SelectID } from '#components/SelectID.js'

export const IDSelection = ({ redirect }: { redirect: string }) => {
	return (
		<>
			<LogoHeader animated />
			<SelectID redirect={redirect} />
		</>
	)
}
