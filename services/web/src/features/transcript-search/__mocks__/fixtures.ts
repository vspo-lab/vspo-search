import type {
	AnalysisData,
	Channel,
	FilterState,
	FollowUpAnswer,
	SearchMessage,
	VideoCard,
	XPostCard,
} from "../types/domain";

// ========================================
// Channels
// ========================================

export const mockChannels: Channel[] = [
	// JP Members
	{ id: "sumire", name: "花芽すみれ", colorHex: "#B0C4DE", group: "JP" },
	{ id: "nazuna", name: "花芽なずな", colorHex: "#FABEDC", group: "JP" },
	{ id: "toto", name: "小雀とと", colorHex: "#F5EB4A", group: "JP" },
	{ id: "uruha", name: "一ノ瀬うるは", colorHex: "#4182FA", group: "JP" },
	{ id: "noa", name: "胡桃のあ", colorHex: "#FFDBFE", group: "JP" },
	{ id: "mimi", name: "兎咲ミミ", colorHex: "#C7B2D6", group: "JP" },
	{ id: "sena", name: "空澄セナ", colorHex: "#FFFFFF", group: "JP" },
	{ id: "hinano", name: "橘ひなの", colorHex: "#FA96C8", group: "JP" },
	{ id: "lisa", name: "英リサ", colorHex: "#D1DE79", group: "JP" },
	{ id: "ren", name: "如月れん", colorHex: "#BE2152", group: "JP" },
	{ id: "kyupi", name: "神成きゅぴ", colorHex: "#FFD23C", group: "JP" },
	{ id: "beni", name: "八雲べに", colorHex: "#85CAB3", group: "JP" },
	{ id: "emma", name: "藍沢エマ", colorHex: "#B4F1F9", group: "JP" },
	{ id: "runa", name: "紫宮るな", colorHex: "#D6ADFF", group: "JP" },
	{ id: "tsuna", name: "猫汰つな", colorHex: "#FF3652", group: "JP" },
	{ id: "ramune", name: "白波らむね", colorHex: "#8ECED9", group: "JP" },
	{ id: "met", name: "小森めと", colorHex: "#FBA03F", group: "JP" },
	{ id: "akari", name: "夢野あかり", colorHex: "#FF998D", group: "JP" },
	{ id: "kuromu", name: "夜乃くろむ", colorHex: "#909EC8", group: "JP" },
	{ id: "kokage", name: "紡木こかげ", colorHex: "#5195E1", group: "JP" },
	{ id: "yuuhi", name: "千燈ゆうひ", colorHex: "#ED784A", group: "JP" },
	{ id: "hanabi", name: "蝶屋はなび", colorHex: "#EA5506", group: "JP" },
	{ id: "moka", name: "甘結もか", colorHex: "#ECA0AA", group: "JP" },
	{ id: "seine", name: "銀城サイネ", colorHex: "#58535E", group: "JP" },
	{ id: "chise", name: "龍巻ちせ", colorHex: "#BEFF77", group: "JP" },
	// EN Members
	{ id: "remia", name: "Remia Aotsuki", colorHex: "#398FB2", group: "EN" },
	{ id: "arya", name: "Arya Kuroha", colorHex: "#000000", group: "EN" },
	{ id: "jira", name: "Jira Jisaki", colorHex: "#606D3D", group: "EN" },
	{ id: "narin", name: "Narin Mikure", colorHex: "#F3A6EF", group: "EN" },
	{ id: "riko", name: "Riko Solari", colorHex: "#9373D7", group: "EN" },
	{ id: "eris", name: "Eris Suzukami", colorHex: "#90B2F8", group: "EN" },
];

// ========================================
// Video Cards (matching wireframe examples)
// ========================================

export const mockVideoCard1: VideoCard = {
	id: "v1",
	title:
		"【VALORANT】CR CUP 本番前日！最後のスクリム練習【花芽すみれ/ぶいすぽっ!】",
	channel: mockChannels[0],
	date: "2025/01/14",
	type: "stream",
	duration: "4:12:30",
	thumbnailGradient: "linear-gradient(135deg, #B0C4DE, #CBC6BE)",
	timestamps: [
		{
			time: "0:45:12",
			timeInSeconds: 2712,
			text: "「大会前の練習ってほんとに緊張する、明日やばいよ」",
			highlightedText:
				"「<mark>大会</mark>前の<mark>練習</mark>ってほんとに緊張する、明日やばいよ」",
		},
		{
			time: "2:30:05",
			timeInSeconds: 9005,
			text: "「今日の練習で大会の作戦固まったかも」",
			highlightedText:
				"「今日の<mark>練習</mark>で<mark>大会</mark>の作戦固まったかも」",
		},
	],
	url: "https://www.youtube.com/watch?v=example1",
};

export const mockVideoCard2: VideoCard = {
	id: "v2",
	title:
		"【APEX】ぶいすぽカスタム大会に向けて猛特訓！！！【橘ひなの/ぶいすぽっ!】",
	channel: mockChannels[7],
	date: "2025/01/11",
	type: "stream",
	duration: "5:23:45",
	thumbnailGradient: "linear-gradient(135deg, #FA96C8, #CBC6BE)",
	timestamps: [
		{
			time: "0:12:30",
			timeInSeconds: 750,
			text: "「大会の練習しないとまずい、めっちゃやる」",
			highlightedText:
				"「<mark>大会</mark>の<mark>練習</mark>しないとまずい、めっちゃやる」",
		},
		{
			time: "3:45:10",
			timeInSeconds: 13510,
			text: "「今日の練習で結構仕上がってきた気がする」",
			highlightedText:
				"「今日の<mark>練習</mark>で結構仕上がってきた気がする」",
		},
	],
	url: "https://www.youtube.com/watch?v=example2",
};

export const mockVideoCard3: VideoCard = {
	id: "v3",
	title: "【切り抜き】大会練習中のぶいすぽメンバーまとめ【VALORANT/APEX】",
	channel: {
		id: "clip-ch",
		name: "ぶいすぽ切り抜き",
		colorHex: "#D9D9D9",
		group: "JP",
	},
	date: "2025/01/16",
	type: "clip",
	duration: "8:42",
	thumbnailGradient: "linear-gradient(135deg, #83A8F9, #CBC6BE)",
	timestamps: [
		{
			time: "0:30",
			timeInSeconds: 30,
			text: "「大会練習中のすみれとひなの」",
			highlightedText:
				"「<mark>大会</mark><mark>練習</mark>中のすみれとひなの」",
		},
	],
	url: "https://www.youtube.com/watch?v=example3",
};

export const mockVideoCard4: VideoCard = {
	id: "v4",
	title:
		"【雑談】最近あったおもしろい話を聞いてくれ〜！！【小森めと/ぶいすぽっ!】",
	channel: mockChannels[16],
	date: "2025/01/20",
	type: "stream",
	duration: "3:15:50",
	thumbnailGradient: "linear-gradient(135deg, #FBA03F, #CBC6BE)",
	timestamps: [
		{
			time: "0:23:15",
			timeInSeconds: 1395,
			text: "「この前おもしろいことがあってさ、聞いて」",
			highlightedText:
				"「この前<mark>おもしろ</mark>いことがあってさ、聞いて」",
		},
		{
			time: "1:45:30",
			timeInSeconds: 6330,
			text: "「雑談配信ってほんと楽しい、おもしろい話いっぱいある」",
			highlightedText:
				"「<mark>雑談</mark>配信ってほんと楽しい、<mark>おもしろ</mark>い話いっぱいある」",
		},
	],
	url: "https://www.youtube.com/watch?v=example4",
};

export const mockVideoCard5: VideoCard = {
	id: "v5",
	title: "【切り抜き】小森めとの爆笑エピソードまとめ【雑談配信ハイライト】",
	channel: {
		id: "clip-ch2",
		name: "ぶいすぽ切り抜きch",
		colorHex: "#D9D9D9",
		group: "JP",
	},
	date: "2025/01/22",
	type: "clip",
	duration: "12:34",
	thumbnailGradient: "linear-gradient(135deg, #FBA03F, #FA96C8)",
	timestamps: [
		{
			time: "2:10",
			timeInSeconds: 130,
			text: "「めとのおもしろすぎる雑談」",
			highlightedText: "「めとの<mark>おもしろ</mark>すぎる<mark>雑談</mark>」",
		},
		{
			time: "7:45",
			timeInSeconds: 465,
			text: "「雑談中に起きたおもしろハプニング集」",
			highlightedText:
				"「<mark>雑談</mark>中に起きた<mark>おもしろ</mark>ハプニング集」",
		},
	],
	url: "https://www.youtube.com/watch?v=example5",
};

export const mockVideoCards: VideoCard[] = [
	mockVideoCard1,
	mockVideoCard2,
	mockVideoCard3,
	mockVideoCard4,
	mockVideoCard5,
];

// ========================================
// X Post Cards
// ========================================

export const mockXPost1: XPostCard = {
	id: "x1",
	authorName: "ぶいすぽ速報",
	authorHandle: "@vspo_feed",
	postedAt: "2025/01/14 21:03",
	text: "CR CUP前日の練習配信、すみれさん仕上がりすごい。明日の大会かなり期待。",
	highlightedText:
		"CR CUP前日の<mark>練習</mark>配信、すみれさん仕上がりすごい。明日の<mark>大会</mark>かなり期待。",
	likeCount: 2400,
	repostCount: 410,
	permalink: "https://x.com/vspo_feed/status/example1",
};

export const mockXPost2: XPostCard = {
	id: "x2",
	authorName: "大会ウォッチャー",
	authorHandle: "@scrim_watch",
	postedAt: "2025/01/14 22:41",
	text: "ひなのさんの練習量もえぐい。今日の仕上がりだと大会当日が楽しみ。",
	highlightedText:
		"ひなのさんの<mark>練習</mark>量もえぐい。今日の仕上がりだと<mark>大会</mark>当日が楽しみ。",
	likeCount: 1800,
	repostCount: 255,
	permalink: "https://x.com/scrim_watch/status/example2",
};

export const mockXPosts: XPostCard[] = [mockXPost1, mockXPost2];

// ========================================
// Follow-up Answer
// ========================================

export const mockAnswer: FollowUpAnswer = {
	title: "回答: 花芽すみれが最も練習量に言及していました",
	body: "抽出した5本の候補動画のうち、練習に関する直接言及の頻度と継続時間が最も高いのは花芽すみれでした。特に大会前日配信で長時間にわたる反復練習が確認できます。",
	citations: [
		{
			sourceType: "youtube",
			label: '花芽すみれ - 0:45:12 「大会前の練習ってほんとに緊張する」',
		},
		{
			sourceType: "youtube",
			label: '花芽すみれ - 2:30:05 「今日の練習で大会の作戦固まった」',
		},
		{
			sourceType: "x",
			label: "@vspo_feed 2025/01/14 21:03 「CR CUP前日の練習配信...大会かなり期待」",
		},
	],
};

// ========================================
// Analysis Data
// ========================================

export const mockAnalysis: AnalysisData = {
	cards: [
		{ label: "Practice Mentions", value: "42" },
		{ label: "Top Member (YouTube)", value: "花芽すみれ" },
		{ label: "Source Share", value: "YouTube 38% / X 62%" },
	],
	bars: [
		{ label: "YouTube", percentage: 38 },
		{ label: "X", percentage: 62 },
		{ label: "Sentiment Peak", percentage: 71 },
	],
};

// ========================================
// Messages (matching wireframe conversation)
// ========================================

export const mockMessages: SearchMessage[] = [
	{
		type: "user",
		content: "大会前に一番多く練習していたのは誰？根拠付きで教えて",
	},
	{
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
	{
		type: "user",
		content: "その3人で「大会前日」と「大会当日」の差分を分析して",
	},
];

// ========================================
// Default filter state
// ========================================

export const defaultFilterState: FilterState = {
	selectedChannels: [],
	dataSource: "all",
	videoTypes: {
		stream: true,
		clip: true,
	},
	outputMode: "search",
	dateRange: {
		start: "2025-01-01",
		end: "2025-01-31",
	},
};
