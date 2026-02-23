import { cn } from "@/shared/lib/utils";

type ProgressBarProps = {
	progress: number;
	color?: string;
	className?: string;
};

export function ProgressBar({
	progress,
	color = "var(--primary)",
	className,
}: ProgressBarProps) {
	const clampedProgress = Math.min(100, Math.max(0, progress));

	return (
		<div
			className={cn("h-[3px] w-full overflow-hidden rounded-full", className)}
			style={{ backgroundColor: "var(--border-separator)" }}
		>
			<div
				className="h-full rounded-full transition-all duration-[var(--dur-md)] ease-[var(--ease)]"
				style={{
					width: `${clampedProgress}%`,
					backgroundColor: color,
				}}
			/>
		</div>
	);
}
