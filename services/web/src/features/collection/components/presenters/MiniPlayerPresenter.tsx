import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/components/ui/Avatar";
import { ProgressBar } from "@/shared/components/ui/ProgressBar";
import type { MiniPlayerState } from "../../types/domain";

type MiniPlayerPresenterProps = {
	state: MiniPlayerState;
	onPlayPause?: () => void;
	onLikeToggle?: () => void;
};

export function MiniPlayerPresenter({
	state,
	onPlayPause,
	onLikeToggle,
}: MiniPlayerPresenterProps) {
	if (!state.clip) return null;

	const { clip } = state;

	return (
		<div
			className="fixed bottom-[89px] left-0 right-0 z-40 bg-background"
			style={{ boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.06)" }}
		>
			{/* Progress bar */}
			<ProgressBar progress={state.progressPercent} />

			{/* Player content */}
			<div className="mx-auto flex max-w-[430px] items-center gap-3 px-5 py-2">
				<Avatar
					size="sm"
					char={clip.member.avatarChar}
					bgColor={clip.member.avatarColor}
				/>

				{/* Track info */}
				<div className="flex min-w-0 flex-1 flex-col">
					<span className="truncate text-[13px] font-medium text-foreground">
						{clip.quoteText}
					</span>
					<span className="truncate text-[11px] text-text-muted">
						{clip.member.name}
					</span>
				</div>

				{/* Controls */}
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={onPlayPause}
						aria-label={state.isPlaying ? "一時停止" : "再生"}
						className={cn(
							"flex h-[35px] w-5 items-center justify-center",
							"text-[20px] text-foreground",
							"transition-colors duration-[var(--dur-fast)]",
						)}
					>
						{state.isPlaying ? "⏸" : "▶"}
					</button>
					<button
						type="button"
						onClick={onLikeToggle}
						aria-label="いいね"
						className={cn(
							"text-[18px]",
							clip.isLiked ? "text-[#FF6B81]" : "text-text-disabled",
						)}
					>
						{clip.isLiked ? "♥" : "♡"}
					</button>
				</div>
			</div>
		</div>
	);
}
