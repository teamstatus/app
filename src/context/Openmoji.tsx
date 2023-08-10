import { createContext, type ComponentChildren, type VNode } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export type OpenmojiIcon = {
	hexcode: string
	search: string
	emoji: string
}

export const OpenmojiContext = createContext<{
	svgFromEmoji: (emoji: string, title?: string) => VNode<any>
	icons: OpenmojiIcon[]
}>({
	svgFromEmoji: (emoji) => <span>{emoji}</span>,
	icons: [],
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [openmojiList, setOpenmojiList] = useState<
		[hexcode: string, search: string, emoji: string, name: string][]
	>([])

	useEffect(() => {
		fetch('/static/openmoji/list.json')
			.then(async (res) => res.json())
			.then(setOpenmojiList)
			.catch(console.error)
	}, [])

	return (
		<OpenmojiContext.Provider
			value={{
				svgFromEmoji: (emoji, title) => {
					const maybeOpenmoji = openmojiList.find(([, , e]) => e === emoji)
					if (maybeOpenmoji === undefined) return <span>{emoji}</span>
					const [hexcode, search] = maybeOpenmoji
					return (
						<img
							class="openmoji"
							src={`/static/openmoji/${hexcode}.svg`}
							alt={title ?? emoji}
							title={title ?? search}
						/>
					)
				},
				icons: openmojiList.map(([hexcode, search, emoji]) => ({
					hexcode,
					search,
					emoji,
				})),
			}}
		>
			{children}
		</OpenmojiContext.Provider>
	)
}

export const useOpenmoji = () => useContext(OpenmojiContext)
