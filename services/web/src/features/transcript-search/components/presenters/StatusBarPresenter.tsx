import { motion } from "framer-motion";

type StatusBarPresenterProps = {
	isLoaded: boolean;
	totalVideos: number;
	totalXPosts?: number;
};

export function StatusBarPresenter({
	isLoaded,
	totalVideos,
	totalXPosts = 0,
}: StatusBarPresenterProps) {
	return (
		<div
			role="status"
			className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-warm px-4 py-2 text-[0.72rem] text-ink-muted"
		>
			<div className="flex items-center gap-2">
				<motion.span
					className="h-1.5 w-1.5 rounded-full bg-[var(--success)]"
					animate={{ opacity: [1, 0.4, 1] }}
					transition={{
						duration: 2,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				/>
				{isLoaded ? (
					<span>
						Data ready &middot;{" "}
						<strong className="font-bold text-ink">
							{totalVideos.toLocaleString()} videos
						</strong>
						{totalXPosts > 0 && (
							<>
								{" "}
								+{" "}
								<strong className="font-bold text-ink">
									{totalXPosts.toLocaleString()} X posts
								</strong>
							</>
						)}
					</span>
				) : (
					<span>Loading data...</span>
				)}
			</div>
			{isLoaded && (
				<div className="flex gap-2">
					<span className="rounded-full border border-border bg-surface px-2 py-0.5 text-[0.66rem]">
						Answer grounding: Enabled
					</span>
					<span className="rounded-full border border-border bg-surface px-2 py-0.5 text-[0.66rem]">
						Source fusion: Enabled
					</span>
				</div>
			)}
		</div>
	);
}
