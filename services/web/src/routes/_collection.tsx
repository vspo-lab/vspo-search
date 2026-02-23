import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { mockMiniPlayer } from "@/features/collection/__mocks__/fixtures";
import { BottomTabBarPresenter } from "@/features/collection/components/presenters/BottomTabBarPresenter";
import { MiniPlayerPresenter } from "@/features/collection/components/presenters/MiniPlayerPresenter";
import type { BottomTab } from "@/features/collection/types/domain";

export const Route = createFileRoute("/_collection")({
	component: CollectionLayout,
});

function CollectionLayout() {
	const [activeTab, setActiveTab] = useState<BottomTab>("home");
	const [miniPlayer, setMiniPlayer] = useState(mockMiniPlayer);
	const navigate = useNavigate();

	const handleTabChange = (tab: BottomTab) => {
		setActiveTab(tab);
		switch (tab) {
			case "home":
				navigate({ to: "/" });
				break;
			case "members":
				navigate({ to: "/members" });
				break;
			case "lists":
				navigate({ to: "/lists" });
				break;
		}
	};

	const handlePlayPause = () => {
		setMiniPlayer((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
	};

	return (
		<div className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-background">
			<main className="flex-1 overflow-y-auto pb-[148px]">
				<Outlet />
			</main>
			<MiniPlayerPresenter
				state={miniPlayer}
				onPlayPause={handlePlayPause}
			/>
			<BottomTabBarPresenter
				activeTab={activeTab}
				onTabChange={handleTabChange}
			/>
		</div>
	);
}
