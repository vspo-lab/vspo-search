/** VTuber channel information */
export type Channel = {
	id: string;
	name: string;
	colorHex: string;
	group: "JP" | "EN";
};

/** Video type classification */
export type VideoType = "stream" | "clip";

/** Data source type */
export type DataSource = "youtube" | "x" | "all";

/** Output mode */
export type OutputMode = "search" | "answer" | "analysis";

/** Timestamp with search result context */
export type Timestamp = {
	time: string;
	timeInSeconds: number;
	text: string;
	highlightedText: string;
};

/** Video card data */
export type VideoCard = {
	id: string;
	title: string;
	channel: Channel;
	date: string;
	type: VideoType;
	duration: string;
	thumbnailGradient: string;
	timestamps: Timestamp[];
	url: string;
};

/** X post card data */
export type XPostCard = {
	id: string;
	authorName: string;
	authorHandle: string;
	postedAt: string;
	text: string;
	highlightedText: string;
	likeCount: number;
	repostCount: number;
	permalink: string;
};

/** Citation in a follow-up answer */
export type Citation = {
	sourceType: "youtube" | "x";
	label: string;
};

/** Follow-up answer with citations */
export type FollowUpAnswer = {
	title: string;
	body: string;
	citations: Citation[];
};

/** Single analysis metric card */
export type AnalysisCard = {
	label: string;
	value: string;
};

/** Single analysis bar row */
export type AnalysisBar = {
	label: string;
	percentage: number;
};

/** Analysis data block */
export type AnalysisData = {
	cards: AnalysisCard[];
	bars: AnalysisBar[];
};

/** User search message */
export type UserMessage = {
	type: "user";
	content: string;
};

/** System response message with search results */
export type SystemMessage = {
	type: "system";
	resultCount: number;
	videos: VideoCard[];
	xPosts?: XPostCard[];
	answer?: FollowUpAnswer;
	analysis?: AnalysisData;
	followUpActions?: string[];
};

/** Union of all chat message types */
export type SearchMessage = UserMessage | SystemMessage;

/** Filter panel state */
export type FilterState = {
	selectedChannels: string[];
	dataSource: DataSource;
	videoTypes: {
		stream: boolean;
		clip: boolean;
	};
	outputMode: OutputMode;
	dateRange: {
		start: string | null;
		end: string | null;
	};
};

/** Status bar data */
export type StatusBarData = {
	isLoaded: boolean;
	totalVideos: number;
	totalXPosts: number;
};
