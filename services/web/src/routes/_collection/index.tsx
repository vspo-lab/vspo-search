import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
	mockClips,
	mockMembers,
} from "@/features/collection/__mocks__/fixtures";
import { HomePagePresenter } from "@/features/collection/components/presenters/HomePagePresenter";
import type { HomeTab } from "@/features/collection/types/domain";

export const Route = createFileRoute("/_collection/")({
	component: HomePage,
});

function HomePage() {
	const [activeTab, setActiveTab] = useState<HomeTab>("popular");
	const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

	const filteredClips = selectedMemberId
		? mockClips.filter((c) => c.memberId === selectedMemberId)
		: mockClips;

	return (
		<HomePagePresenter
			members={mockMembers}
			clips={filteredClips}
			activeTab={activeTab}
			selectedMemberId={selectedMemberId}
			highlightedClipId={mockClips[0].id}
			onTabChange={setActiveTab}
			onMemberSelect={setSelectedMemberId}
		/>
	);
}
