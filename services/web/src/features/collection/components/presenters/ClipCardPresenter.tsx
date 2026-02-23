import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/components/ui/Avatar";
import { LikeButton } from "@/shared/components/ui/LikeButton";
import { ProgressBar } from "@/shared/components/ui/ProgressBar";
import type { AudioClip } from "../../types/domain";

type ClipCardPresenterProps = {
	clip: AudioClip;
	isHighlighted?: boolean;
	onLikeToggle?: () => void;
	onPlay?: () => void;
};

export function ClipCardPresenter({
	clip,
	isHighlighted = false,
	onLikeToggle,
	onPlay,
}: ClipCardPresenterProps) {
	return (
		<button
			type="button"
			onClick={onPlay}
			className={cn(
				"flex w-full items-center gap-3.5 px-5 text-left",
				"transition-colors duration-[var(--dur-fast)] ease-[var(--ease)]",
				isHighlighted
					? "bg-surface-highlight py-5"
					: "border-b py-4",
			)}
			style={
				!isHighlighted
					? { borderColor: "var(--border-card)" }
					: undefined
			}
		>
			{/* Avatar */}
			<Avatar
				size="md"
				char={clip.member.avatarChar}
				bgColor={clip.member.avatarColor}
				hasRing={isHighlighted}
			/>

			{/* Content */}
			<div className="flex min-w-0 flex-1 flex-col gap-[3px]">
				{/* Quote text */}
				<span className="text-[14px] font-bold leading-snug text-foreground">
					{clip.quoteText}
				</span>

				{/* Member + timestamp */}
				<div className="flex items-center gap-1.5 text-[12px] text-text-muted">
					<span>{clip.member.name}</span>
					<span
						className="h-[3px] w-[3px] shrink-0 rounded-full"
						style={{ backgroundColor: "var(--border-separator)" }}
					/>
					<span>{clip.timestampLabel}</span>
				</div>

				{/* Time range + progress bar */}
				<div className="mt-0.5 flex items-center gap-2">
					<span className="text-[11px] tabular-nums text-text-muted">
						{clip.timeRange.start}
					</span>
					<span className="text-[11px] tabular-nums text-text-muted">
						{clip.timeRange.end}
					</span>
					<ProgressBar
						progress={clip.progressPercent}
						className="flex-1"
					/>
				</div>
			</div>

			{/* Like button */}
			<div
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<LikeButton
					count={clip.likeCount}
					isLiked={clip.isLiked}
					onToggle={onLikeToggle}
				/>
			</div>
		</button>
	);
}
