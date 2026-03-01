import { cn } from "@/shared/lib/utils";

type LikeButtonProps = {
	count?: number;
	isLiked: boolean;
	onToggle?: () => void;
	className?: string;
};

export function LikeButton({
	count,
	isLiked,
	onToggle,
	className,
}: LikeButtonProps) {
	return (
		<button
			type="button"
			onClick={onToggle}
			aria-label={isLiked ? "いいねを取り消す" : "いいね"}
			className={cn(
				"flex flex-col items-center gap-0.5",
				"transition-colors duration-[var(--dur-fast)] ease-[var(--ease)]",
				className,
			)}
		>
			<span
				className={cn(
					"text-[15px] leading-none",
					isLiked ? "text-[#FF6B81]" : "text-text-disabled",
				)}
			>
				{isLiked ? "♥" : "♡"}
			</span>
			{count !== undefined && (
				<span className="text-[11px] tabular-nums text-text-muted">
					{count}
				</span>
			)}
		</button>
	);
}
