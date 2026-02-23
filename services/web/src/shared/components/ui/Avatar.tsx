import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const avatarVariants = cva(
	"inline-flex items-center justify-center rounded-full font-bold select-none shrink-0",
	{
		variants: {
			size: {
				sm: "h-9 w-9 text-[13px]",
				md: "h-11 w-11 text-[15px]",
				lg: "h-20 w-20 text-[32px]",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

type AvatarProps = VariantProps<typeof avatarVariants> & {
	char: string;
	bgColor: string;
	hasRing?: boolean;
	className?: string;
};

export function Avatar({
	size,
	char,
	bgColor,
	hasRing = false,
	className,
}: AvatarProps) {
	return (
		<div
			className={cn(
				avatarVariants({ size }),
				hasRing && "shadow-[var(--shadow-avatar-ring)]",
				size === "lg" && hasRing && "shadow-[var(--shadow-profile-avatar)]",
				className,
			)}
			style={{ backgroundColor: bgColor, color: "#FFFFFF" }}
		>
			{char}
		</div>
	);
}
