import { cn } from "@/shared/lib/utils";
import type { Playlist } from "../../types/domain";

type PlaylistCardPresenterProps = {
	playlist: Playlist;
	onOpen?: () => void;
};

export function PlaylistCardPresenter({
	playlist,
	onOpen,
}: PlaylistCardPresenterProps) {
	return (
		<button
			type="button"
			onClick={onOpen}
			className={cn(
				"flex w-full flex-col gap-3 rounded-[16px] p-5 text-left",
				"transition-all duration-[var(--dur-fast)] ease-[var(--ease)]",
				"hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
			)}
			style={{
				background: playlist.gradient ?? "var(--bg)",
				border: `1px solid ${playlist.borderColor ?? "transparent"}`,
				boxShadow: "var(--shadow-card)",
			}}
		>
			{/* Header */}
			<div className="flex items-center justify-between">
				<span className="text-[15px] font-bold text-foreground">
					{playlist.name}
				</span>
				<span className="text-[12px] text-text-muted">
					{playlist.clipCount}曲
				</span>
			</div>

			{/* Member chips */}
			<div className="flex flex-wrap gap-2">
				{playlist.memberChips.map((chip) => (
					<span
						key={chip.name}
						className="rounded-full px-2.5 py-1 text-[11px] font-medium"
						style={{
							backgroundColor: `${chip.color}20`,
							color: chip.color,
						}}
					>
						{chip.name}
					</span>
				))}
			</div>

			{/* Action row */}
			<div className="flex items-center gap-3 text-[12px] text-text-muted">
				<span>▶ 再生</span>
				<span>⋯</span>
			</div>
		</button>
	);
}
