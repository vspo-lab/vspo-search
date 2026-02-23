import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
	mockClips,
	mockMembers,
} from "@/features/collection/__mocks__/fixtures";
import { MemberDetailPagePresenter } from "@/features/collection/components/presenters/MemberDetailPagePresenter";
import type { SortOption } from "@/features/collection/types/domain";

export const Route = createFileRoute("/_collection/members/$memberId")({
	component: MemberDetailPage,
});

function MemberDetailPage() {
	const { memberId } = Route.useParams();
	const navigate = useNavigate();
	const [sortOption, setSortOption] = useState<SortOption>("popular");

	const member = mockMembers.find((m) => m.id === memberId) ?? mockMembers[0];
	const clips = mockClips.filter((c) => c.memberId === member.id);

	return (
		<MemberDetailPagePresenter
			member={member}
			clips={clips}
			sortOption={sortOption}
			onBack={() => navigate({ to: "/" })}
			onSortChange={setSortOption}
		/>
	);
}
