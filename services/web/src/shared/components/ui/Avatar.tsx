import type { Member } from "@/shared/lib/members";
import { cn } from "@/shared/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const avatarVariants = cva(
	"inline-flex items-center justify-center rounded-full font-bold select-none shrink-0",
	{
		variants: {
			size: {
				xs: "h-7 w-7 text-[11px]",
				sm: "h-9 w-9 text-[13px]",
				md: "h-11 w-11 text-[15px]",
				lg: "h-20 w-20 text-[32px]",
				xl: "h-28 w-28 text-[40px]",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

type AvatarBaseProps = VariantProps<typeof avatarVariants> & {
	hasRing?: boolean;
	className?: string;
};

type AvatarProps = AvatarBaseProps &
	(
		| { member: Member; char?: never; bgColor?: never }
		| { member?: never; char: string; bgColor: string }
	);

export function Avatar(props: AvatarProps) {
	const { size, hasRing = false, className } = props;
	const char = props.member ? props.member.initial : props.char;
	const bgColor = props.member ? props.member.color : props.bgColor;
	const textColor = props.member
		? props.member.avatarTextColor === "dark"
			? "#1A1A1A"
			: "#FFFFFF"
		: "#FFFFFF";

	return (
		<div
			className={cn(
				avatarVariants({ size }),
				hasRing && "shadow-[var(--shadow-avatar-ring)]",
				size === "lg" && hasRing && "shadow-[var(--shadow-profile-avatar)]",
				className,
			)}
			style={{ backgroundColor: bgColor, color: textColor }}
		>
			{char}
		</div>
	);
}
