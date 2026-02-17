import type { Meta, StoryObj } from "@storybook/react";
import { mockAnswer } from "../../__mocks__/fixtures";
import { AnswerCardPresenter } from "./AnswerCardPresenter";

const meta = {
	title: "TranscriptSearch/AnswerCardPresenter",
	component: AnswerCardPresenter,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-[680px] max-md:w-[360px]">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof AnswerCardPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		answer: mockAnswer,
	},
};

export const NoCitations: Story = {
	args: {
		answer: {
			title: "回答: 該当する結果が見つかりました",
			body: "検索結果の分析に基づき、要約された回答です。引用はありません。",
			citations: [],
		},
	},
};

export const Mobile: Story = {
	args: {
		answer: mockAnswer,
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
	decorators: [
		(Story) => (
			<div className="w-full p-4">
				<Story />
			</div>
		),
	],
};
