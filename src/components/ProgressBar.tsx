export const ProgressBar = ({ title }: { title: string }) => (
	<div class="text-center">
		<div class="progress">
			<div
				class="progress-bar progress-bar-striped progress-bar-animated"
				role="progressbar"
				aria-label="Auto-login progress ..."
				aria-valuenow={50}
				aria-valuemin={0}
				aria-valuemax={100}
				style="width: 50%"
			></div>
		</div>
		<p>{title}</p>
	</div>
)
