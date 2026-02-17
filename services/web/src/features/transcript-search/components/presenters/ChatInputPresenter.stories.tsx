import type { Meta, StoryObj } from "@storybook/react";
import { ChatInputPresenter } from "./ChatInputPresenter";

const meta = {
	title: "TranscriptSearch/ChatInputPresenter",
	component: ChatInputPresenter,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-[600px]">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof ChatInputPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: "",
		activeMode: "search",
		onModeChange: () => {},
		activeSource: "all",
		onSourceChange: () => {},
	},
};

export const WithValue: Story = {
	args: {
		value: "大会 練習",
		activeMode: "search",
		onModeChange: () => {},
		activeSource: "all",
		onSourceChange: () => {},
	},
};

export const AnswerMode: Story = {
	args: {
		value: "大会前に一番練習していたのは誰？",
		activeMode: "answer",
		onModeChange: () => {},
		activeSource: "all",
		onSourceChange: () => {},
	},
};

export const AnalysisMode: Story = {
	args: {
		value: "",
		activeMode: "analysis",
		onModeChange: () => {},
		activeSource: "youtube",
		onSourceChange: () => {},
	},
};

export const XSourceOnly: Story = {
	args: {
		value: "",
		activeMode: "search",
		onModeChange: () => {},
		activeSource: "x",
		onSourceChange: () => {},
	},
};

export const Disabled: Story = {
	args: {
		value: "",
		isDisabled: true,
		activeMode: "search",
		onModeChange: () => {},
		activeSource: "all",
		onSourceChange: () => {},
	},
};
