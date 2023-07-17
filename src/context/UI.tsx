import { createContext, type ComponentChildren } from 'preact'
import { useContext, useState } from 'preact/hooks'

export const UIContext = createContext<{
	projectsMenuVisible: boolean
	showProjectsMenu: (visible: boolean) => unknown
}>({
	projectsMenuVisible: false,
	showProjectsMenu: () => undefined,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [projectsMenuVisible, showProjectsMenu] = useState<boolean>(false)

	return (
		<UIContext.Provider
			value={{
				projectsMenuVisible,
				showProjectsMenu,
			}}
		>
			{children}
		</UIContext.Provider>
	)
}

export const Consumer = UIContext.Consumer

export const useUI = () => useContext(UIContext)
