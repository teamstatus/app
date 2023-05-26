import {
	ChevronLeft,
	ChevronRightIcon,
	LogOut,
	MoreHorizontal,
	Palette,
	Plus,
	Send,
	SmilePlus,
	Sprout,
	Trash,
	UploadCloud,
	User,
	X,
	type LucideIcon,
} from 'lucide-preact'

const strokeWidth = 1

const icon =
	(Icon: LucideIcon) =>
	({ class: c }: { class?: string }) =>
		<Icon strokeWidth={strokeWidth} class={c} />

export const UserIcon = icon(User)
export const CloseIcon = icon(X)
export const BackIcon = icon(ChevronLeft)
export const CollapseRightIcon = icon(ChevronRightIcon)
export const SubmitIcon = icon(Send)
export const ColorsIcon = icon(Palette)
export const AddIcon = icon(Plus)
export const ProjectsIcon = icon(Sprout)
export const PersistencePendingIcon = icon(UploadCloud)
export const LogoutIcon = icon(LogOut)
export const SubMenuIcon = icon(MoreHorizontal)
export const AddReactionIcon = icon(SmilePlus)
export const DeleteIcon = icon(Trash)
