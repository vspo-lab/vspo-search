import { Play } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { VideoCard } from "../../types/domain";

type VideoCardPresenterProps = {
	video: VideoCard;
};

export function VideoCardPresenter({ video }: VideoCardPresenterProps) {
	return (
		<div
			className={cn(
				"group flex gap-3.5 p-3.5 rounded-md bg-background border border-border",
				"cursor-pointer",
				"transition-all duration-[var(--dur-fast)] ease-[var(--ease)]",
				"hover:border-border-strong hover:shadow-[var(--shadow-card)] hover:-translate-y-px",
				"focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)]",
				"max-md:flex-col",
			)}
			role="article"
		>
			{/* Thumbnail */}
			<div className="relative h-[86px] w-[152px] shrink-0 overflow-hidden rounded-sm max-md:h-auto max-md:w-full max-md:aspect-video">
				<div
					className="absolute inset-0"
					style={{ background: video.thumbnailGradient }}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

				{/* Duration badge */}
				<span className="absolute bottom-1.5 right-1.5 z-10 rounded-sm bg-black/75 px-1.5 py-0.5 text-[0.65rem] font-bold tracking-wide text-white">
					{video.duration}
				</span>

				{/* Play icon on hover */}
				<div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-[var(--dur-fast)] group-hover:opacity-100">
					<div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/90">
						<Play className="ml-0.5 h-3 w-3 fill-ink text-ink" />
					</div>
				</div>
			</div>

			{/* Video info */}
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				{/* Title */}
				<div className="line-clamp-2 text-[0.84rem] font-bold leading-snug text-ink">
					{video.title}
				</div>

				{/* Meta row */}
				<div className="flex flex-wrap items-center gap-[7px] text-[0.72rem] text-ink-muted">
					<span className="flex items-center gap-1 font-medium text-ink-soft">
						<span
							className="h-1.5 w-1.5 shrink-0 rounded-full"
							style={{ backgroundColor: video.channel.colorHex }}
						/>
						{video.channel.name}
					</span>
					<span className="h-[3px] w-[3px] rounded-full bg-grey" />
					<span>{video.date}</span>
					<span
						className={cn(
							"rounded-full border px-[7px] py-0.5 text-[0.65rem] font-bold tracking-wide",
							video.type === "stream"
								? "border-border bg-surface-soft text-ink-soft"
								: "border-border bg-surface-soft text-ink-soft",
						)}
					>
						{video.type === "stream" ? "配信" : "切り抜き"}
					</span>
				</div>

				{/* Timestamps */}
				{video.timestamps.length > 0 && (
					<div className="mt-0.5 flex flex-col gap-1">
						{video.timestamps.map((ts) => (
							<a
								key={ts.timeInSeconds}
								href={`${video.url}&t=${ts.timeInSeconds}s`}
								className={cn(
									"group/ts inline-flex items-start gap-1.5 text-[0.73rem] leading-relaxed text-ink-soft no-underline",
									"transition-colors duration-[var(--dur-fast)] ease-[var(--ease)]",
									"hover:text-ink",
									"focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-1 focus-visible:rounded-sm",
								)}
							>
								<span
									className={cn(
										"mt-px shrink-0 rounded-sm border px-1.5 py-px font-mono text-[0.66rem] font-bold",
										"border-[var(--accent-alpha-30)] bg-[var(--accent-alpha-12)] text-accent-text",
										"transition-all duration-[var(--dur-fast)] ease-[var(--ease)]",
										"group-hover/ts:border-accent group-hover/ts:bg-accent group-hover/ts:text-white",
									)}
								>
									{ts.time}
								</span>
								<span
									className="text-ink-muted"
									dangerouslySetInnerHTML={{ __html: ts.highlightedText }}
								/>
							</a>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
