import { useEffect, useState } from 'preact/hooks'
import {
	useOpenmoji,
	type OpenmojiIcon as OpenmojiIconType,
} from '#context/Openmoji.js'
import { OpenmojiIcon } from '#components/OpenmojiIcon.js'

export const IconPicker = ({ onIcon }: { onIcon: (icon: string) => void }) => {
	const { icons } = useOpenmoji()
	const [search, setSearch] = useState<string>('')
	const [match, setMatch] = useState<OpenmojiIconType[]>([])
	useEffect(() => {
		if (search.length < 3) return
		setMatch(
			icons
				.filter(({ search: s }) =>
					s.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
				)
				.slice(0, 20),
		)
	}, [search])
	return (
		<>
			<div class="mt-2">
				<label
					class="d-flex align-items-center justify-content-start"
					htmlFor="iconSearch"
				>
					<span class="text-nowrap">Search for an icon:</span>
				</label>
				<div class="d-flex justify-items-start align-items-start">
					<input
						id="iconSearch"
						type="search"
						class="form-control me-2"
						value={search}
						onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
						placeholder={`e.g. 'rocket'`}
						style={{ width: '125px' }}
					/>
					<div>
						{match.map((icon) => (
							<button
								type="button"
								class="btn btn-sm btn-outline-secondary me-1 mb-1"
								onClick={() => {
									onIcon(icon.emoji)
								}}
							>
								<OpenmojiIcon emoji={icon.emoji} />
							</button>
						))}
					</div>
				</div>
			</div>
		</>
	)
}
