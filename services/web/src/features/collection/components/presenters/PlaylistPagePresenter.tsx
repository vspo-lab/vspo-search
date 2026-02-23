import type { Playlist } from "../../types/domain";
import { PlaylistCardPresenter } from "./PlaylistCardPresenter";

type PlaylistPagePresenterProps = {
	playlists: Playlist[];
	onCreateNew?: () => void;
	onOpenPlaylist?: (playlistId: string) => void;
};

export function PlaylistPagePresenter({
	playlists,
	onCreateNew,
	onOpenPlaylist,
}: PlaylistPagePresenterProps) {
	return (
		<div className="flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between px-5 pt-14 pb-0">
				<h1 className="text-[20px] font-bold leading-[1.2] text-foreground">
					プレイリスト
				</h1>
				<button
					type="button"
					onClick={onCreateNew}
					className="rounded-full px-4 py-2 text-[13px] font-bold text-background"
					style={{ backgroundColor: "var(--primary)" }}
				>
					+ 新規作成
				</button>
			</div>

			{/* Playlist cards */}
			<div className="flex flex-col gap-4 px-5 pt-5">
				{playlists.map((playlist) => (
					<PlaylistCardPresenter
						key={playlist.id}
						playlist={playlist}
						onOpen={() => onOpenPlaylist?.(playlist.id)}
					/>
				))}
			</div>
		</div>
	);
}
