import { cn } from "@/shared/lib/utils";
import type { Member } from "../../types/domain";

type MemberFilterPresenterProps = {
	members: Member[];
	selectedMemberId: string | null;
	onSelect?: (memberId: string | null) => void;
};

export function MemberFilterPresenter({
	members,
	selectedMemberId,
	onSelect,
}: MemberFilterPresenterProps) {
	const isAllSelected = selectedMemberId === null;

	return (
		<div className="flex gap-2 overflow-x-auto px-5 pt-4 pb-0 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{/* "All" chip */}
			<button
				type="button"
				onClick={() => onSelect?.(null)}
				className={cn(
					"shrink-0 rounded-full px-4 py-2 text-[13px] font-medium leading-[1.2]",
					"transition-all duration-[var(--dur-fast)] ease-[var(--ease)]",
					isAllSelected
						? "bg-primary text-background"
						: "bg-surface-chip text-text-secondary",
				)}
			>
				全員
			</button>

			{/* Member chips */}
			{members.map((member) => {
				const isActive = selectedMemberId === member.id;
				return (
					<button
						key={member.id}
						type="button"
						onClick={() => onSelect?.(member.id)}
						className={cn(
							"shrink-0 rounded-full px-4 py-2 text-[13px] font-medium leading-[1.2]",
							"transition-all duration-[var(--dur-fast)] ease-[var(--ease)]",
							isActive
								? "bg-primary text-background"
								: "bg-surface-chip text-text-secondary",
						)}
					>
						{member.name}
					</button>
				);
			})}
		</div>
	);
}
