import type { Meta, StoryObj } from "@storybook/react";
import {
	mockAnalysis,
	mockAnswer,
	mockVideoCard1,
	mockVideoCard2,
	mockVideoCard3,
	mockXPosts,
} from "../../__mocks__/fixtures";
import { ChatMessagePresenter } from "./ChatMessagePresenter";

const meta = {
	title: "TranscriptSearch/ChatMessagePresenter",
	component: ChatMessagePresenter,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-[800px] p-6">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof ChatMessagePresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
	args: {
		message: {
			type: "user",
			content: "大会 練習",
		},
	},
};

export const SystemMessageWithResults: Story = {
	args: {
		message: {
			type: "system",
			resultCount: 3,
			videos: [mockVideoCard1, mockVideoCard2, mockVideoCard3],
		},
	},
};

export const SystemMessageWithAllSections: Story = {
	args: {
		message: {
			type: "system",
			resultCount: 8,
			videos: [mockVideoCard1, mockVideoCard2],
			xPosts: mockXPosts,
			answer: mockAnswer,
			analysis: mockAnalysis,
			followUpActions: [
				"比較分析を続ける",
				"X反応を深掘り",
				"根拠をもっと表示",
			],
		},
	},
};

export const SystemMessageZeroResults: Story = {
	args: {
		message: {
			type: "system",
			resultCount: 0,
			videos: [],
		},
	},
};

export const Conversation: Story = {
	args: {} as any,
	render: () => (
		<div className="flex flex-col gap-5">
			<ChatMessagePresenter
				message={{
					type: "user",
					content:
						"大会前に一番多く練習していたのは誰？根拠付きで教えて",
				}}
			/>
			<ChatMessagePresenter
				message={{
					type: "system",
					resultCount: 8,
					videos: [mockVideoCard1, mockVideoCard2],
					xPosts: mockXPosts,
					answer: mockAnswer,
					analysis: mockAnalysis,
					followUpActions: [
						"比較分析を続ける",
						"X反応を深掘り",
						"根拠をもっと表示",
					],
				}}
			/>
		</div>
	),
};
