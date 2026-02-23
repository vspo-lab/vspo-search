import type { AudioClip, Member, SortOption } from "../../types/domain";
import { MemberClipListPresenter } from "./MemberClipListPresenter";
import { MemberProfileHeaderPresenter } from "./MemberProfileHeaderPresenter";

type MemberDetailPagePresenterProps = {
	member: Member;
	clips: AudioClip[];
	sortOption: SortOption;
	onBack?: () => void;
	onSortChange?: (option: SortOption) => void;
	onClipPlay?: (clipId: string) => void;
	onLikeToggle?: (clipId: string) => void;
};

export function MemberDetailPagePresenter({
	member,
	clips,
	sortOption,
	onBack,
	onSortChange,
	onClipPlay,
	onLikeToggle,
}: MemberDetailPagePresenterProps) {
	return (
		<div className="flex flex-col">
			<MemberProfileHeaderPresenter member={member} onBack={onBack} />

			<MemberClipListPresenter
				clips={clips}
				totalCount={member.clipCount}
				sortOption={sortOption}
				onSortChange={onSortChange}
				onClipPlay={onClipPlay}
				onLikeToggle={onLikeToggle}
			/>
		</div>
	);
}
