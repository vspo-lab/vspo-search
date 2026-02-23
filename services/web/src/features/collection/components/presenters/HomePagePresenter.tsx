import type { AudioClip, HomeTab, Member } from "../../types/domain";
import { ClipListPresenter } from "./ClipListPresenter";
import { HomeHeaderPresenter } from "./HomeHeaderPresenter";
import { MemberFilterPresenter } from "./MemberFilterPresenter";
import { TabBarPresenter } from "./TabBarPresenter";

type HomePagePresenterProps = {
	members: Member[];
	clips: AudioClip[];
	activeTab: HomeTab;
	selectedMemberId: string | null;
	highlightedClipId?: string;
	onTabChange?: (tab: HomeTab) => void;
	onMemberSelect?: (memberId: string | null) => void;
	onClipPlay?: (clipId: string) => void;
	onLikeToggle?: (clipId: string) => void;
};

export function HomePagePresenter({
	members,
	clips,
	activeTab,
	selectedMemberId,
	highlightedClipId,
	onTabChange,
	onMemberSelect,
	onClipPlay,
	onLikeToggle,
}: HomePagePresenterProps) {
	return (
		<div className="flex flex-col">
			<HomeHeaderPresenter />

			<TabBarPresenter activeTab={activeTab} onTabChange={onTabChange} />

			<MemberFilterPresenter
				members={members}
				selectedMemberId={selectedMemberId}
				onSelect={onMemberSelect}
			/>

			<div className="pt-2">
				<ClipListPresenter
					clips={clips}
					highlightedClipId={highlightedClipId}
					onClipPlay={onClipPlay}
					onLikeToggle={onLikeToggle}
				/>
			</div>
		</div>
	);
}
