import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { mockMembers } from "@/features/collection/__mocks__/fixtures";
import { Avatar } from "@/shared/components/ui/Avatar";

export const Route = createFileRoute("/_collection/members/")({
	component: MembersListPage,
});

function MembersListPage() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col">
			<div className="px-5 pt-14 pb-4">
				<h1 className="text-[20px] font-bold leading-[1.2] text-foreground">
					メンバー
				</h1>
			</div>

			<div className="grid grid-cols-3 gap-4 px-5">
				{mockMembers.map((member) => (
					<button
						key={member.id}
						type="button"
						onClick={() =>
							navigate({
								to: "/members/$memberId",
								params: { memberId: member.id },
							})
						}
						className="flex flex-col items-center gap-2 rounded-[16px] py-4 transition-colors duration-[var(--dur-fast)] hover:bg-surface-chip"
					>
						<Avatar
							size="md"
							char={member.avatarChar}
							bgColor={member.avatarColor}
						/>
						<span className="text-[12px] font-medium text-foreground">
							{member.name}
						</span>
						<span className="text-[11px] text-text-muted">
							{member.clipCount}クリップ
						</span>
					</button>
				))}
			</div>
		</div>
	);
}
