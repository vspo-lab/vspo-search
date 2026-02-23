import type { AudioClip } from "../../types/domain";
import { ClipCardPresenter } from "./ClipCardPresenter";

type ClipListPresenterProps = {
	clips: AudioClip[];
	highlightedClipId?: string;
	onClipPlay?: (clipId: string) => void;
	onLikeToggle?: (clipId: string) => void;
};

export function ClipListPresenter({
	clips,
	highlightedClipId,
	onClipPlay,
	onLikeToggle,
}: ClipListPresenterProps) {
	return (
		<div className="flex flex-col">
			{clips.map((clip) => (
				<ClipCardPresenter
					key={clip.id}
					clip={clip}
					isHighlighted={clip.id === highlightedClipId}
					onPlay={() => onClipPlay?.(clip.id)}
					onLikeToggle={() => onLikeToggle?.(clip.id)}
				/>
			))}
		</div>
	);
}
