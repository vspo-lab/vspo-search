import { cn } from "@/shared/lib/utils";
import type { BottomTab } from "../../types/domain";

type TabItem = {
	id: BottomTab;
	icon: string;
	label: string;
	href: string;
};

const tabs: TabItem[] = [
	{ id: "home", icon: "☖", label: "ホーム", href: "/" },
	{ id: "members", icon: "☆", label: "メンバー", href: "/members" },
	{ id: "lists", icon: "☰", label: "リスト", href: "/lists" },
	{ id: "add", icon: "+", label: "追加", href: "#" },
];

type BottomTabBarPresenterProps = {
	activeTab: BottomTab;
	onTabChange?: (tab: BottomTab) => void;
};

export function BottomTabBarPresenter({
	activeTab,
	onTabChange,
}: BottomTabBarPresenterProps) {
	return (
		<nav
			className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background pt-2"
			style={{
				borderColor: "var(--border-separator)",
				boxShadow: "var(--shadow-tab-bar)",
			}}
		>
			<div className="mx-auto flex max-w-[430px] items-stretch justify-stretch">
				{tabs.map((tab) => {
					const isActive = tab.id === activeTab;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => onTabChange?.(tab.id)}
							className={cn(
								"flex flex-1 flex-col items-center gap-1 pb-[1px]",
								"transition-colors duration-[var(--dur-fast)] ease-[var(--ease)]",
							)}
						>
							<span
								className={cn(
									"text-[22px] leading-[1.2]",
									isActive
										? "text-primary"
										: "text-icon-inactive",
								)}
							>
								{tab.icon}
							</span>
							<span
								className={cn(
									"text-[10px] font-medium leading-[1.2]",
									isActive
										? "text-primary"
										: "text-text-inactive",
								)}
							>
								{tab.label}
							</span>
						</button>
					);
				})}
			</div>
			{/* Safe area spacer for iOS */}
			<div className="h-[env(safe-area-inset-bottom,0px)]" />
		</nav>
	);
}
