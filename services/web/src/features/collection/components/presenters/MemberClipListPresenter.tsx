import { cn } from "@/shared/lib/utils";
import { LikeButton } from "@/shared/components/ui/LikeButton";
import type { AudioClip, SortOption } from "../../types/domain";

type MemberClipListPresenterProps = {
	clips: AudioClip[];
	totalCount: number;
	sortOption: SortOption;
	onSortChange?: (option: SortOption) => void;
	onClipPlay?: (clipId: string) => void;
	onLikeToggle?: (clipId: string) => void;
};

export function MemberClipListPresenter({
	clips,
	totalCount,
	sortOption,
	onSortChange,
	onClipPlay,
	onLikeToggle,
}: MemberClipListPresenterProps) {
	return (
		<div className="flex flex-col">
			{/* Header row */}
			<div className="flex items-center justify-between px-5 py-3">
				<span className="text-[13px] text-text-muted">
					{totalCount}件のクリップ
				</span>
				<button
					type="button"
					onClick={() =>
						onSortChange?.(
							sortOption === "popular" ? "newest" : "popular",
						)
					}
					className="text-[13px] font-bold text-primary"
				>
					{sortOption === "popular" ? "人気順" : "新着順"} ▾
				</button>
			</div>

			{/* Clip rows */}
			<div className="flex flex-col px-5">
				{clips.map((clip) => (
					<div
						key={clip.id}
						className={cn(
							"flex items-center gap-3.5 border-b py-3",
						)}
						style={{ borderColor: "var(--border-card)" }}
					>
						{/* Play button */}
						<button
							type="button"
							onClick={() => onClipPlay?.(clip.id)}
							aria-label="再生"
							className="flex h-5 w-5 shrink-0 items-center justify-center text-[12px] text-text-muted"
						>
							▶
						</button>

						{/* Member avatar */}
						<div
							className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
							style={{
								backgroundColor: "var(--surface-member-avatar)",
								color: clip.member.avatarColor,
							}}
						>
							{clip.member.avatarChar}
						</div>

						{/* Clip info */}
						<div className="flex min-w-0 flex-1 flex-col gap-[3px]">
							<span className="truncate text-[14px] font-bold leading-snug text-foreground">
								{clip.quoteText}
							</span>
							<div className="flex items-center gap-1.5 text-[12px] text-text-muted">
								<span>{clip.member.name}</span>
								<span
									className="h-[3px] w-[3px] shrink-0 rounded-full"
									style={{
										backgroundColor: "var(--border-separator)",
									}}
								/>
								<span>{clip.timestampLabel}</span>
							</div>
						</div>

						{/* Like */}
						<LikeButton
							count={clip.likeCount}
							isLiked={clip.isLiked}
							onToggle={() => onLikeToggle?.(clip.id)}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
