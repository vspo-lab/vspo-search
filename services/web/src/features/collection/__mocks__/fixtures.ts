import type {
	AudioClip,
	Member,
	MiniPlayerState,
	Playlist,
} from "../types/domain";

// ========================================
// Members
// ========================================

export const mockMembers: Member[] = [
	{
		id: "sumire",
		name: "花芽すみれ",
		avatarChar: "す",
		avatarColor: "#D4A8E8",
		clipCount: 24,
	},
	{
		id: "toto",
		name: "小雀遊",
		avatarChar: "遊",
		avatarColor: "#A8D8EA",
		clipCount: 18,
	},
	{
		id: "runa",
		name: "紫宮るな",
		avatarChar: "る",
		avatarColor: "#E8B8D4",
		clipCount: 21,
	},
	{
		id: "hinano",
		name: "藤井ひなた",
		avatarChar: "ひ",
		avatarColor: "#F5D0A8",
		clipCount: 15,
	},
	{
		id: "noa",
		name: "胡桃のあ",
		avatarChar: "の",
		avatarColor: "#B8E8C8",
		clipCount: 19,
	},
	{
		id: "sena",
		name: "空澄セナ",
		avatarChar: "セ",
		avatarColor: "#A8C8E8",
		clipCount: 12,
	},
	{
		id: "nazuna",
		name: "花芽なずな",
		avatarChar: "な",
		avatarColor: "#D4A8E8",
		clipCount: 16,
	},
	{
		id: "met",
		name: "小森めと",
		avatarChar: "め",
		avatarColor: "#E8B8D4",
		clipCount: 22,
	},
];

// ========================================
// Audio Clips (matching Figma)
// ========================================

export const mockClips: AudioClip[] = [
	{
		id: "c1",
		memberId: "sumire",
		member: mockMembers[0],
		quoteText: "「やったー！勝ったー！」",
		timestampLabel: "0:05",
		timeRange: { start: "0:02", end: "0:05" },
		durationSeconds: 5,
		progressPercent: 100,
		likeCount: 128,
		isLiked: true,
		sourceUrl: "https://example.com/clip1",
	},
	{
		id: "c2",
		memberId: "toto",
		member: mockMembers[1],
		quoteText: "「ありがとう、みんな」",
		timestampLabel: "0:03",
		timeRange: { start: "0:00", end: "0:03" },
		durationSeconds: 3,
		progressPercent: 0,
		likeCount: 96,
		isLiked: true,
		sourceUrl: "https://example.com/clip2",
	},
	{
		id: "c3",
		memberId: "runa",
		member: mockMembers[2],
		quoteText: "「うそでしょ！？マジで！？」",
		timestampLabel: "0:04",
		timeRange: { start: "0:01", end: "0:04" },
		durationSeconds: 4,
		progressPercent: 0,
		likeCount: 84,
		isLiked: false,
		sourceUrl: "https://example.com/clip3",
	},
	{
		id: "c4",
		memberId: "hinano",
		member: mockMembers[3],
		quoteText: "「おはよ〜ございます！」",
		timestampLabel: "0:03",
		timeRange: { start: "0:00", end: "0:03" },
		durationSeconds: 3,
		progressPercent: 0,
		likeCount: 72,
		isLiked: true,
		sourceUrl: "https://example.com/clip4",
	},
	{
		id: "c5",
		memberId: "noa",
		member: mockMembers[4],
		quoteText: "「なんでやねん！」",
		timestampLabel: "0:02",
		timeRange: { start: "0:00", end: "0:02" },
		durationSeconds: 2,
		progressPercent: 0,
		likeCount: 65,
		isLiked: false,
		sourceUrl: "https://example.com/clip5",
	},
	{
		id: "c6",
		memberId: "sena",
		member: mockMembers[5],
		quoteText: "「えー！すごーい！」",
		timestampLabel: "0:03",
		timeRange: { start: "0:01", end: "0:03" },
		durationSeconds: 3,
		progressPercent: 0,
		likeCount: 58,
		isLiked: true,
		sourceUrl: "https://example.com/clip6",
	},
	{
		id: "c7",
		memberId: "sumire",
		member: mockMembers[0],
		quoteText: "「大会前の練習ってほんとに緊張する」",
		timestampLabel: "0:06",
		timeRange: { start: "0:00", end: "0:06" },
		durationSeconds: 6,
		progressPercent: 0,
		likeCount: 52,
		isLiked: false,
		sourceUrl: "https://example.com/clip7",
	},
	{
		id: "c8",
		memberId: "runa",
		member: mockMembers[2],
		quoteText: "「やばいやばいやばい！」",
		timestampLabel: "0:03",
		timeRange: { start: "0:01", end: "0:03" },
		durationSeconds: 3,
		progressPercent: 0,
		likeCount: 47,
		isLiked: true,
		sourceUrl: "https://example.com/clip8",
	},
];

// ========================================
// Playlists
// ========================================

export const mockPlaylists: Playlist[] = [
	{
		id: "pl1",
		name: "お気に入りボイス",
		clipCount: 12,
		memberChips: [
			{ name: "すみれ", color: "#D4A8E8" },
			{ name: "るな", color: "#E8B8D4" },
			{ name: "ひなた", color: "#F5D0A8" },
		],
		gradient:
			"linear-gradient(135deg, rgba(255, 245, 247, 1) 0%, rgba(255, 255, 255, 1) 100%)",
		borderColor: "#FCE4EC",
	},
	{
		id: "pl2",
		name: "面白クリップ集",
		clipCount: 8,
		memberChips: [
			{ name: "遊", color: "#A8D8EA" },
			{ name: "のあ", color: "#B8E8C8" },
		],
	},
	{
		id: "pl3",
		name: "癒しボイス",
		clipCount: 15,
		memberChips: [
			{ name: "セナ", color: "#A8C8E8" },
			{ name: "すみれ", color: "#D4A8E8" },
			{ name: "ひなた", color: "#F5D0A8" },
			{ name: "るな", color: "#E8B8D4" },
		],
	},
	{
		id: "pl4",
		name: "ゲーム名場面",
		clipCount: 6,
		memberChips: [
			{ name: "すみれ", color: "#D4A8E8" },
			{ name: "遊", color: "#A8D8EA" },
		],
	},
];

// ========================================
// Mini Player State
// ========================================

export const mockMiniPlayer: MiniPlayerState = {
	clip: mockClips[0],
	isPlaying: true,
	progressPercent: 60,
};
