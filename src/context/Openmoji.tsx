import { createContext, type ComponentChildren, type VNode } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export type OpenmojiIcon = {
	hexcode: string
	search: string
	emoji: string
}

export const OpenmojiContext = createContext<{
	fromEmoji: (emoji: string, black?: true) => VNode<any>
	svgFromEmoji: (emoji: string, black?: true) => VNode<any>
	icons: OpenmojiIcon[]
}>({
	fromEmoji: (emoji) => <span>{emoji}</span>,
	svgFromEmoji: (emoji) => <span>{emoji}</span>,
	icons: [],
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [openmojiList, setOpenmojiList] = useState<
		[hexcode: string, search: string, emoji: string, name: string][]
	>([])
	const [openmojiComponent, setOpenmojiComponent] = useState<
		Record<string, () => VNode<any>>
	>({})

	useEffect(() => {
		fetch('/static/openmoji/list.json')
			.then(async (res) => res.json())
			.then(setOpenmojiList)
			.catch(console.error)
	}, [])

	return (
		<OpenmojiContext.Provider
			value={{
				fromEmoji: (emoji, black) => {
					const maybeOpenmoji = openmojiList.find(([, , e]) => e === emoji)
					if (maybeOpenmoji === undefined) return <span>{emoji}</span>
					const [hexcode, , , name] = maybeOpenmoji
					const exportName = `${name}${black === true ? 'Black' : ''}`
					const key = `${hexcode}:${black === true ? 'Black' : 'Color'}`
					if (openmojiComponent[key] === undefined) {
						import(
							/* @vite-ignore */
							`../openmoji/${hexcode}.jsx`
						)
							.then((module) => {
								if (module[exportName] !== undefined) {
									setOpenmojiComponent((components) => ({
										...components,
										[key]: module[exportName],
									}))
								}
							})
							.catch(console.error)
					}
					return openmojiComponent[key]?.() ?? <span>{emoji}</span>
				},
				svgFromEmoji: (emoji, black) => {
					const maybeOpenmoji = openmojiList.find(([, , e]) => e === emoji)
					if (maybeOpenmoji === undefined) return <span>{emoji}</span>
					const [hexcode, search] = maybeOpenmoji
					return (
						<img
							class="openmoji"
							src={`/static/openmoji/${hexcode}${
								black === true ? 'Black' : ''
							}.svg`}
							alt={emoji}
							title={search}
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
