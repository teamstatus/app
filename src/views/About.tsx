import { useEffect, useState } from 'preact/hooks'
import { Ago } from '../components/Ago.js'
import { colors, logoColors } from '../components/Colorpicker.js'
import { ReactionsHelp } from '../components/ReactionsHelp.js'
import { SelectID } from '../components/SelectID.js'
import { useAuth } from '../context/Auth.js'

export const About = () => {
	const { user } = useAuth()
	const [offset, setOffset] = useState<number>(logoColors.length - 1)
	useEffect(() => {
		const i = setInterval(() => {
			setOffset((i) => (i - 1 > 0 ? i - 1 : logoColors.length - 1))
		}, 60)
		return () => {
			clearInterval(i)
		}
	}, [])

	const colorAtIndex = (i: number) =>
		logoColors[(i + offset) % logoColors.length]

	return (
		<>
			<header class="bg-dark">
				<div class="container">
					<div class="d-flex align-items-center pt-2 pb-2 pt-md-4 pb-md-4">
						<h1 class="fs-4 fw-bold m-0">
							<img
								src="/static/heart.svg"
								alt="❤️ teamstatus"
								width="25"
								height="25"
								class="me-2"
							/>
							{'teamstatus.space'.split('').map((s, i) => (
								<span style={{ color: colorAtIndex(i) }}>{s}</span>
							))}
						</h1>
					</div>
				</div>
			</header>
			<main class="container">
				<section>
					<div class="row mt-3">
						<div class="col-12">
							<p>Welcome {user?.id ?? user?.email ?? 'anonymous'}!</p>
						</div>
					</div>
				</section>
				{user?.id !== undefined && <ReactionsHelp />}
				{user?.id === undefined && <SelectID />}
				<aside class="clearfix mt-3">
					<h2>Colors</h2>
					{colors.map((color) => (
						<div
							style={{
								backgroundColor: color,
								width: '32px',
								height: '32px',
								borderRadius: '25%',
								display: 'block',
								float: 'left',
								margin: '0.1rem',
							}}
						></div>
					))}
				</aside>
				<aside class="row mt-3">
					<h2>About</h2>
					<dl class="col">
						<dt>Version</dt>
						<dd>{VERSION}</dd>
						<dt>build time</dt>
						<dd>
							<time dateTime={BUILD_TIME}>
								<Ago date={new Date(BUILD_TIME)} />
							</time>
						</dd>
					</dl>
				</aside>
			</main>
		</>
	)
}
