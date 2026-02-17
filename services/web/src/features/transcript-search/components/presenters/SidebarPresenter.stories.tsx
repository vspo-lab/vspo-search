import type { Meta, StoryObj } from "@storybook/react";
import { defaultFilterState, mockChannels } from "../../__mocks__/fixtures";
import { SidebarPresenter } from "./SidebarPresenter";

const meta = {
	title: "TranscriptSearch/SidebarPresenter",
	component: SidebarPresenter,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="flex min-h-screen">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof SidebarPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		channels: mockChannels.filter((ch) => ch.group === "JP").slice(0, 12),
		filters: defaultFilterState,
		onDataSourceChange: () => {},
		onOutputModeChange: () => {},
	},
};

export const WithActiveFilters: Story = {
	args: {
		channels: mockChannels.filter((ch) => ch.group === "JP").slice(0, 12),
		filters: {
			selectedChannels: ["sumire", "hinano"],
			dataSource: "all",
			videoTypes: { stream: true, clip: false },
			outputMode: "search",
			dateRange: { start: "2025-01-01", end: "2025-01-31" },
		},
		onDataSourceChange: () => {},
		onOutputModeChange: () => {},
	},
};

export const YouTubeSourceOnly: Story = {
	args: {
		channels: mockChannels.filter((ch) => ch.group === "JP").slice(0, 12),
		filters: {
			...defaultFilterState,
			dataSource: "youtube",
		},
		onDataSourceChange: () => {},
		onOutputModeChange: () => {},
	},
};

export const AnswerMode: Story = {
	args: {
		channels: mockChannels.filter((ch) => ch.group === "JP").slice(0, 12),
		filters: {
			...defaultFilterState,
			outputMode: "answer",
		},
		onDataSourceChange: () => {},
		onOutputModeChange: () => {},
	},
};

export const AllChannels: Story = {
	args: {
		channels: mockChannels,
		filters: defaultFilterState,
		onDataSourceChange: () => {},
		onOutputModeChange: () => {},
	},
};

export const MobileOpen: Story = {
	args: {
		channels: mockChannels.filter((ch) => ch.group === "JP").slice(0, 12),
		filters: defaultFilterState,
		isOpen: true,
		onDataSourceChange: () => {},
		onOutputModeChange: () => {},
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};
