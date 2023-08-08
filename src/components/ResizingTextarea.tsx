import { useEffect, useRef, useState } from 'preact/hooks'

export const ResizingTextarea = ({
	value,
	onInput,
	id,
	placeholder,
}: {
	id: string
	placeholder: string
	value: string
	onInput: (value: string) => void
}) => {
	const shadowRef = useRef<HTMLDivElement>(null)
	const textAreaRef = useRef<HTMLTextAreaElement>(null)
	const [height, setHeight] = useState<string | number>('auto')

	useEffect(() => {
		if (shadowRef.current === null) return
		const next = shadowRef.current.scrollHeight
		if (typeof height === 'string') {
			setHeight(next)
			return
		}
		const current = textAreaRef.current?.getBoundingClientRect()?.height ?? 0
		if (next > current) setHeight(next)
	}, [shadowRef, value])

	return (
		<>
			<textarea
				class="form-control"
				id={id}
				placeholder={placeholder}
				minLength={1}
				value={value}
				onInput={(e) => onInput((e.target as HTMLTextAreaElement).value)}
				autoFocus
				style={{
					height,
				}}
				ref={textAreaRef}
			></textarea>
			<div class="form-text">Markdown is supported.</div>
			<div
				ref={shadowRef}
				style={{
					height: '0px',
					margin: '0',
					padding: '1rem',
					visibility: 'hidden',
				}}
			>
				{value.split('\n').map((t) => (
					<>
						{t} <br />
					</>
				))}
			</div>
		</>
	)
}
