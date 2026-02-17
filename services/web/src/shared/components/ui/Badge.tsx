import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center gap-1.5 text-[0.72rem] font-medium px-2.5 py-1 rounded-full border",
	{
		variants: {
			variant: {
				default: "bg-surface border-border text-ink-soft",
				accent:
					"bg-[var(--accent-alpha-12)] border-[var(--accent-alpha-30)] text-accent-text",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

type BadgeProps = VariantProps<typeof badgeVariants> & {
	icon?: React.ReactNode;
	children: React.ReactNode;
};

export function Badge({ variant, icon, children }: BadgeProps) {
	return (
		<span className={cn(badgeVariants({ variant }))}>
			{icon && <span className="w-3 h-3 [&>svg]:w-3 [&>svg]:h-3">{icon}</span>}
			{children}
		</span>
	);
}
