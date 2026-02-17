import type { Meta, StoryObj } from "@storybook/react";
import { StatusBarPresenter } from "./StatusBarPresenter";

const meta = {
	title: "TranscriptSearch/StatusBarPresenter",
	component: StatusBarPresenter,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof StatusBarPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = {
	args: {
		isLoaded: true,
		totalVideos: 1847,
		totalXPosts: 5230,
	},
};

export const LoadedWithoutXPosts: Story = {
	args: {
		isLoaded: true,
		totalVideos: 1847,
		totalXPosts: 0,
	},
};

export const Loading: Story = {
	args: {
		isLoaded: false,
		totalVideos: 0,
		totalXPosts: 0,
	},
};
