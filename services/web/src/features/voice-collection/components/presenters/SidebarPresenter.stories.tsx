import type { Meta, StoryObj } from "@storybook/react";
import {
	RouterProvider,
	createMemoryHistory,
	createRootRoute,
	createRouter,
} from "@tanstack/react-router";
import { mockPlaylists } from "../../__mocks__/fixtures";
import { SidebarPresenter } from "./SidebarPresenter";

function createStoryRouter(Story: React.ComponentType) {
	const rootRoute = createRootRoute({
		component: () => (
			<div className="w-[260px] h-screen border-r border-border bg-surface">
				<Story />
			</div>
		),
	});
	const routeTree = rootRoute.addChildren([]);
	return createRouter({
		routeTree,
		history: createMemoryHistory({ initialEntries: ["/"] }),
	});
}

const meta = {
	title: "VoiceCollection/Sidebar",
	component: SidebarPresenter,
	tags: ["autodocs"],
	decorators: [(Story) => <RouterProvider router={createStoryRouter(Story)} />],
} satisfies Meta<typeof SidebarPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { playlists: mockPlaylists },
};
