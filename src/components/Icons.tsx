import {
	AlertCircle,
	Calendar,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	HelpCircle,
	LogOut,
	MessagesSquare,
	MoreHorizontal,
	Palette,
	Pen,
	Plus,
	Send,
	SmilePlus,
	Sprout,
	Trash,
	UploadCloud,
	User,
	UserCircle2,
	Users,
	X,
	type LucideIcon,
} from 'lucide-preact'

const strokeWidth = 1
const size = 24
const icon =
	(Icon: LucideIcon) =>
	({
		class: c,
		color: col,
		size: s,
		strokeWidth: sw,
	}: {
		class?: string
		color?: string
		size?: number
		strokeWidth?: number
	}) =>
		(
			<Icon
				strokeWidth={sw ?? strokeWidth}
				class={c}
				size={s ?? size}
				color={col}
			/>
		)

export const UserIcon = icon(User)
export const CalendarIcon = icon(Calendar)
export const CloseIcon = icon(X)
export const BackIcon = icon(ChevronLeft)
export const CollapseRightIcon = icon(ChevronRight)
export const NextIcon = icon(ChevronRight)
export const SubmitIcon = icon(Send)
export const ColorsIcon = icon(Palette)
export const AddIcon = icon(Plus)
export const ProjectsIcon = icon(Sprout)
export const PersistencePendingIcon = icon(UploadCloud)
export const LogoutIcon = icon(LogOut)
export const SubMenuIcon = icon(MoreHorizontal)
export const AddReactionIcon = icon(SmilePlus)
export const DeleteIcon = icon(Trash)
export const EditIcon = icon(Pen)
export const SignificantIcon = icon(AlertCircle)
export const QuestionIcon = icon(HelpCircle)
export const HelpIcon = icon(HelpCircle)
export const AuthorIcon = icon(UserCircle2)
export const MembersIcon = icon(Users)
export const SyncIcon = icon(MessagesSquare)
export const UpIcon = icon(ChevronUp)
export const DownIcon = icon(ChevronDown)
