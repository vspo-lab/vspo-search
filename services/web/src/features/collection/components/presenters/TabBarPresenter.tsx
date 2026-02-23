import { cn } from "@/shared/lib/utils";
import type { HomeTab } from "../../types/domain";

type TabBarPresenterProps = {
	activeTab: HomeTab;
	onTabChange?: (tab: HomeTab) => void;
};

const tabItems: { id: HomeTab; label: string }[] = [
	{ id: "popular", label: "人気" },
	{ id: "newest", label: "新着" },
];

export function TabBarPresenter({
	activeTab,
	onTabChange,
}: TabBarPresenterProps) {
	return (
		<div
			className="flex gap-6 border-b pl-5"
			style={{ borderColor: "var(--border-separator)" }}
		>
			{tabItems.map((tab) => {
				const isActive = tab.id === activeTab;
				return (
					<button
						key={tab.id}
						type="button"
						onClick={() => onTabChange?.(tab.id)}
						className={cn(
							"relative py-3 text-[14px] font-bold leading-[1.2]",
							"transition-colors duration-[var(--dur-fast)] ease-[var(--ease)]",
							isActive ? "text-foreground" : "text-text-disabled",
						)}
					>
						{tab.label}
						{isActive && (
							<span
								className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
								style={{ backgroundColor: "var(--primary)" }}
							/>
						)}
					</button>
				);
			})}
		</div>
	);
}
