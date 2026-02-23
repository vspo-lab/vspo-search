import { Avatar } from "@/shared/components/ui/Avatar";
import type { Member } from "../../types/domain";

type MemberProfileHeaderPresenterProps = {
	member: Member;
	onBack?: () => void;
};

export function MemberProfileHeaderPresenter({
	member,
	onBack,
}: MemberProfileHeaderPresenterProps) {
	return (
		<div
			className="relative flex flex-col items-center pb-6"
			style={{
				background:
					"linear-gradient(180deg, rgba(232, 212, 240, 1) 0%, rgba(245, 238, 249, 1) 100%)",
			}}
		>
			{/* Back button */}
			<button
				type="button"
				onClick={onBack}
				aria-label="戻る"
				className="absolute left-5 top-14 text-[20px] text-text-secondary"
			>
				←
			</button>

			{/* Avatar */}
			<div className="pt-14">
				<Avatar
					size="lg"
					char={member.avatarChar}
					bgColor={member.avatarColor}
					hasRing
				/>
			</div>

			{/* Name */}
			<h1 className="mt-3 text-center text-[20px] font-bold leading-[1.2] text-foreground">
				{member.name}
			</h1>

			{/* Stats */}
			<div className="mt-3 flex items-center justify-center gap-6">
				<div className="flex flex-col items-center gap-0.5">
					<span className="text-[18px] font-bold tabular-nums text-foreground">
						{member.clipCount}
					</span>
					<span className="text-[11px] text-text-muted">クリップ</span>
				</div>
				<div className="flex flex-col items-center gap-0.5">
					<span className="text-[18px] font-bold tabular-nums text-primary">
						♥
					</span>
					<span className="text-[11px] text-text-muted">お気に入り</span>
				</div>
			</div>
		</div>
	);
}
