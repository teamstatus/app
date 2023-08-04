import { useEffect, useState } from 'preact/hooks'
import {
	useOpenmoji,
	type OpenmojiIcon as OpenmojiIconType,
} from '#context/Openmoji.js'
import { OpenmojiIcon } from '#components/OpenmojiIcon.js'
import { CloseIcon } from '#components/Icons.js'
import cx from 'classnames'

const skinTones = {
	dark: '🏿',
	'medium-dark': '🏾',
	medium: '🏽',
	'medium-light': '🏼',
	light: '🏻',
	neutral: '🟨',
}

export const IconPicker = ({ onIcon }: { onIcon: (icon: string) => void }) => {
	const { icons } = useOpenmoji()
	const [search, setSearch] = useState<string>('')
	const [match, setMatch] = useState<OpenmojiIconType[]>([])
	const [skinToneFilter, setSkinToneFilter] = useState<
		keyof typeof skinTones | undefined
	>()
	useEffect(() => {
		if (search.length < 2) return

		setMatch(
			icons
				.filter(({ search }) =>
					skinToneFilter === undefined
						? true
						: skinToneFilter === 'neutral'
						? !search.includes('skin tone')
						: search.includes(`${skinToneFilter} skin tone`),
				)
				.filter(
					({ search: s, emoji }) =>
						emoji === search ||
						s.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
				)
				.slice(0, 50),
		)
	}, [search, skinToneFilter])
	return (
		<div>
			<div class="mb-3 d-flex justify-items-start align-items-start flex-row">
				<div>
					<label for="emojiSearch" class="form-label text-nowrap">
						Search for an icon
					</label>
					<input
						id="emojiSearch"
						type="search"
						class="form-control me-2"
						value={search}
						onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
						placeholder={`e.g. 'rocket'`}
						style={{ width: '125px' }}
					/>
				</div>
				<div>
					<label class="form-label text-nowrap">Filter by skin tone</label>
					<div>
						{Object.entries(skinTones).map(([name, emoji]) => (
							<button
								class={cx('btn btn-sm me-1', {
									['btn-outline-secondary']: skinToneFilter !== name,
									['btn-secondary']: skinToneFilter === name,
								})}
								onClick={() =>
									setSkinToneFilter(name as keyof typeof skinTones)
								}
								disabled={skinToneFilter === name}
							>
								<OpenmojiIcon emoji={emoji} />
							</button>
						))}
						<button
							class="btn btn-sm btn-outline-secondary"
							onClick={() => setSkinToneFilter(undefined)}
							disabled={skinToneFilter === undefined}
						>
							<CloseIcon />
						</button>
					</div>
				</div>
			</div>
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
	)
}
