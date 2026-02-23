/** VTuber member */
export type Member = {
	id: string;
	name: string;
	avatarChar: string;
	avatarColor: string;
	clipCount: number;
};

/** Audio clip */
export type AudioClip = {
	id: string;
	memberId: string;
	member: Member;
	quoteText: string;
	timestampLabel: string;
	timeRange: {
		start: string;
		end: string;
	};
	durationSeconds: number;
	progressPercent: number;
	likeCount: number;
	isLiked: boolean;
	sourceUrl: string;
};

/** Playlist member chip */
export type PlaylistMemberChip = {
	name: string;
	color: string;
};

/** Playlist */
export type Playlist = {
	id: string;
	name: string;
	clipCount: number;
	memberChips: PlaylistMemberChip[];
	gradient?: string;
	borderColor?: string;
};

/** Bottom navigation tab */
export type BottomTab = "home" | "members" | "lists" | "add";

/** Home page content tab */
export type HomeTab = "popular" | "newest";

/** Sort option */
export type SortOption = "popular" | "newest";

/** Mini player state */
export type MiniPlayerState = {
	clip: AudioClip | null;
	isPlaying: boolean;
	progressPercent: number;
};
