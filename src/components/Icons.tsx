import {
	AlertCircle,
	ArrowLeftFromLine,
	ArrowRightFromLine,
	Calendar,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Clock,
	Eye,
	EyeOff,
	FolderSync,
	HelpCircle,
	LogOut,
	MoreHorizontal,
	Palette,
	Pen,
	Plus,
	RefreshCw,
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
	Menu,
	LogIn,
	Settings,
	Crown,
	EyeIcon,
	UserCheck,
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
	}) => (
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
export const LogInIcon = icon(LogIn)
export const SubMenuIcon = icon(MoreHorizontal)
export const AddReactionIcon = icon(SmilePlus)
export const DeleteIcon = icon(Trash)
export const EditIcon = icon(Pen)
export const SignificantIcon = icon(AlertCircle)
export const QuestionIcon = icon(HelpCircle)
export const HelpIcon = icon(HelpCircle)
export const AuthorIcon = icon(UserCircle2)
export const MembersIcon = icon(Users)
export const SyncIcon = icon(RefreshCw)
export const SyncsIcon = icon(FolderSync)
export const UpIcon = icon(ChevronUp)
export const DownIcon = icon(ChevronDown)
export const VisibleIcon = icon(Eye)
export const HiddenIcon = icon(EyeOff)
export const ApplyIcon = icon(Check)
export const StartDateIcon = icon(ArrowRightFromLine)
export const EndDateIcon = icon(ArrowLeftFromLine)
export const ClockIcon = icon(Clock)
export const MenuIcon = icon(Menu)
export const SettingsIcon = icon(Settings)
export const OwnerIcon = icon(Crown)
export const WatcherIcon = icon(EyeIcon)
export const AcceptInvitationIcon = icon(UserCheck)
export const InfoIcon = icon(HelpCircle)
