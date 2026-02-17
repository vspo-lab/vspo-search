import type { Meta, StoryObj } from "@storybook/react";
import { mockAnalysis } from "../../__mocks__/fixtures";
import { AnalysisSectionPresenter } from "./AnalysisSectionPresenter";

const meta = {
	title: "TranscriptSearch/AnalysisSectionPresenter",
	component: AnalysisSectionPresenter,
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
} satisfies Meta<typeof AnalysisSectionPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		analysis: mockAnalysis,
	},
};

export const CardsOnly: Story = {
	args: {
		analysis: {
			cards: mockAnalysis.cards,
			bars: [],
		},
	},
};

export const BarsOnly: Story = {
	args: {
		analysis: {
			cards: [],
			bars: mockAnalysis.bars,
		},
	},
};

export const Mobile: Story = {
	args: {
		analysis: mockAnalysis,
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
