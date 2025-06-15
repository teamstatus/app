import { useEffect, useRef, useState } from 'preact/hooks'
import { Fragment } from 'preact/jsx-runtime'

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
		void value // Trigger re-render when value changes
		if (shadowRef.current === null) return
		const next = shadowRef.current.scrollHeight
		if (typeof height === 'string') {
			setHeight(next + 16)
			return
		}
		const current = textAreaRef.current?.getBoundingClientRect()?.height ?? 0
		if (next > current) setHeight(next)
	}, [value, height])

	return (
		<>
			<textarea
				class="form-control"
				id={id}
				placeholder={placeholder}
				minLength={1}
				value={value}
				onInput={(e) => onInput((e.target as HTMLTextAreaElement).value)}
				style={{
					height,
				}}
				ref={textAreaRef}
			/>
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
					<Fragment>
						{t} <br />
					</Fragment>
				))}
			</div>
		</>
	)
}
