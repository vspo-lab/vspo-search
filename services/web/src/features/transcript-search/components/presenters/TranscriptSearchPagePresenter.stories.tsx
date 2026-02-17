import type { Meta, StoryObj } from "@storybook/react";
import {
	defaultFilterState,
	mockChannels,
	mockMessages,
} from "../../__mocks__/fixtures";
import { TranscriptSearchPagePresenter } from "./TranscriptSearchPagePresenter";

const meta = {
	title: "TranscriptSearch/TranscriptSearchPagePresenter",
	component: TranscriptSearchPagePresenter,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof TranscriptSearchPagePresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
	channels: mockChannels.filter((ch) => ch.group === "JP").slice(0, 12),
	filters: defaultFilterState,
	isSidebarOpen: false,
	onSidebarToggle: () => {},
	onSidebarClose: () => {},
	onChannelToggle: () => {},
	onTypeToggle: () => {},
	onDateChange: () => {},
	onDataSourceChange: () => {},
	onOutputModeChange: () => {},
	isLoaded: true,
	totalVideos: 1847,
	totalXPosts: 5230,
	inputValue: "",
	onInputChange: () => {},
	onSearch: () => {},
	isSearchDisabled: false,
	activeMode: "search" as const,
	onModeChange: () => {},
	activeSource: "all" as const,
	onSourceChange: () => {},
};

export const InitialState: Story = {
	args: {
		...defaultArgs,
		messages: [],
	},
};

export const WithResults: Story = {
	args: {
		...defaultArgs,
		messages: mockMessages,
	},
};

export const Loading: Story = {
	args: {
		...defaultArgs,
		isLoaded: false,
		totalVideos: 0,
		totalXPosts: 0,
		messages: [],
		isSearchDisabled: true,
	},
};

export const Mobile: Story = {
	args: {
		...defaultArgs,
		messages: mockMessages,
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};
