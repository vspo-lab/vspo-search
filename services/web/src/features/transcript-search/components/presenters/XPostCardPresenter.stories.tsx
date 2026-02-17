import type { Meta, StoryObj } from "@storybook/react";
import { mockXPost1, mockXPost2 } from "../../__mocks__/fixtures";
import { XPostCardPresenter } from "./XPostCardPresenter";

const meta = {
	title: "TranscriptSearch/XPostCardPresenter",
	component: XPostCardPresenter,
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
} satisfies Meta<typeof XPostCardPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		post: mockXPost1,
	},
};

export const AltPost: Story = {
	args: {
		post: mockXPost2,
	},
};

export const CardList: Story = {
	args: {} as any,
	render: () => (
		<div className="flex flex-col gap-2">
			<XPostCardPresenter post={mockXPost1} />
			<XPostCardPresenter post={mockXPost2} />
		</div>
	),
};

export const Mobile: Story = {
	args: {
		post: mockXPost1,
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
