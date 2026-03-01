import { Avatar } from "@/shared/components/ui/Avatar";
import { LikeButton } from "@/shared/components/ui/LikeButton";
import { getMemberById } from "@/shared/lib/members";
import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useLikes } from "../../hooks/useLikes";
import { usePlayerContext } from "../../providers/PlayerProvider";

export function PlayerBarPresenter() {
	const {
		currentClip,
		isPlaying,
		progress,
		volume,
		pause,
		resume,
		next,
		prev,
		seek,
		setVolume,
	} = usePlayerContext();
	const { isLiked, toggleLike } = useLikes();

	if (!currentClip) {
		return (
			<div className="h-[72px] bg-surface border-t border-border flex items-center justify-center text-ink-muted text-sm">
				Select a clip to play
			</div>
		);
	}

	const member = getMemberById(currentClip.memberId);
	if (!member) return null;

	return (
		<div className="bg-surface border-t border-border">
			{/* Progress bar */}
			<div
				className="h-1 bg-border cursor-pointer group relative"
				onClick={(e) => {
					const rect = e.currentTarget.getBoundingClientRect();
					seek((e.clientX - rect.left) / rect.width);
				}}
				onKeyDown={(e) => {
					if (e.key === "ArrowRight") seek(Math.min(1, progress + 0.05));
					if (e.key === "ArrowLeft") seek(Math.max(0, progress - 0.05));
				}}
				role="slider"
				aria-label="Seek"
				aria-valuenow={Math.round(progress * 100)}
				aria-valuemin={0}
				aria-valuemax={100}
				tabIndex={0}
			>
				<div
					className="h-full bg-accent transition-[width] duration-100"
					style={{ width: `${progress * 100}%` }}
				/>
				<div
					className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
					style={{
						left: `${progress * 100}%`,
						transform: "translate(-50%, -50%)",
					}}
				/>
			</div>

			<div className="h-[68px] flex items-center px-6 gap-6">
				{/* Now playing info */}
				<div className="flex items-center gap-3 w-[240px] shrink-0">
					<Avatar member={member} size="md" />
					<div className="min-w-0">
						<div className="text-sm font-medium truncate">
							{currentClip.title}
						</div>
						<div className="text-xs text-ink-muted truncate">{member.name}</div>
					</div>
					<LikeButton
						count={currentClip.likeCount}
						isLiked={isLiked(currentClip.id)}
						onToggle={() => toggleLike(currentClip.id)}
						className="ml-2"
					/>
				</div>

				{/* Controls */}
				<div className="flex items-center gap-4 flex-1 justify-center">
					<button
						type="button"
						onClick={prev}
						className="text-ink-soft hover:text-ink transition-colors"
						aria-label="Previous"
					>
						<SkipBack size={18} />
					</button>
					<button
						type="button"
						onClick={isPlaying ? pause : resume}
						className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center hover:bg-ink-soft transition-colors"
						aria-label={isPlaying ? "Pause" : "Play"}
					>
						{isPlaying ? (
							<Pause size={16} />
						) : (
							<Play size={16} className="ml-0.5" />
						)}
					</button>
					<button
						type="button"
						onClick={next}
						className="text-ink-soft hover:text-ink transition-colors"
						aria-label="Next"
					>
						<SkipForward size={18} />
					</button>
				</div>

				{/* Volume */}
				<div className="flex items-center gap-2 w-[140px] shrink-0 justify-end">
					<Volume2 size={16} className="text-ink-muted" />
					<input
						type="range"
						min={0}
						max={1}
						step={0.01}
						value={volume}
						onChange={(e) => setVolume(Number(e.target.value))}
						className="w-20 accent-accent"
						aria-label="Volume"
					/>
				</div>
			</div>
		</div>
	);
}
