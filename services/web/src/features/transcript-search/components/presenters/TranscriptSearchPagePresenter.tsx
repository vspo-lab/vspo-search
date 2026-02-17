import type {
	Channel,
	DataSource,
	FilterState,
	OutputMode,
	SearchMessage,
} from "../../types/domain";
import { ChatInputPresenter } from "./ChatInputPresenter";
import { ChatMessagePresenter } from "./ChatMessagePresenter";
import { HeaderPresenter } from "./HeaderPresenter";
import { HeroPresenter } from "./HeroPresenter";
import { SidebarPresenter } from "./SidebarPresenter";
import { StatusBarPresenter } from "./StatusBarPresenter";

type TranscriptSearchPagePresenterProps = {
	// Filter state
	channels: Channel[];
	filters: FilterState;
	isSidebarOpen: boolean;
	onSidebarToggle: () => void;
	onSidebarClose: () => void;
	onChannelToggle: (channelId: string) => void;
	onTypeToggle: (type: "stream" | "clip") => void;
	onDateChange: (field: "start" | "end", value: string) => void;
	onDataSourceChange: (source: DataSource) => void;
	onOutputModeChange: (mode: OutputMode) => void;

	// Status
	isLoaded: boolean;
	totalVideos: number;
	totalXPosts: number;

	// Chat
	messages: SearchMessage[];

	// Input
	inputValue: string;
	onInputChange: (value: string) => void;
	onSearch: () => void;
	isSearchDisabled: boolean;
	activeMode: OutputMode;
	onModeChange: (mode: OutputMode) => void;
	activeSource: DataSource;
	onSourceChange: (source: DataSource) => void;
};

export function TranscriptSearchPagePresenter({
	channels,
	filters,
	isSidebarOpen,
	onSidebarToggle,
	onSidebarClose,
	onChannelToggle,
	onTypeToggle,
	onDateChange,
	onDataSourceChange,
	onOutputModeChange,
	isLoaded,
	totalVideos,
	totalXPosts,
	messages,
	inputValue,
	onInputChange,
	onSearch,
	isSearchDisabled,
	activeMode,
	onModeChange,
	activeSource,
	onSourceChange,
}: TranscriptSearchPagePresenterProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<HeaderPresenter onFilterToggle={onSidebarToggle} />
			<HeroPresenter />

			<div className="mx-auto flex w-full max-w-screen-xl flex-1">
				<SidebarPresenter
					channels={channels}
					filters={filters}
					isOpen={isSidebarOpen}
					onClose={onSidebarClose}
					onChannelToggle={onChannelToggle}
					onTypeToggle={onTypeToggle}
					onDateChange={onDateChange}
					onDataSourceChange={onDataSourceChange}
					onOutputModeChange={onOutputModeChange}
				/>

				<main
					className="flex min-w-0 flex-1 flex-col"
					role="log"
					aria-live="polite"
				>
					<StatusBarPresenter
						isLoaded={isLoaded}
						totalVideos={totalVideos}
						totalXPosts={totalXPosts}
					/>

					{/* Chat messages */}
					<div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6 max-md:px-4">
						{messages.map((msg, i) => (
							<ChatMessagePresenter key={i} message={msg} />
						))}
					</div>

					{/* Input area */}
					<div className="sticky bottom-0 bg-gradient-to-t from-background via-background/60 to-transparent px-6 pb-6 pt-4 max-md:px-4 max-md:pb-5 max-md:pt-3">
						<ChatInputPresenter
							value={inputValue}
							onChange={onInputChange}
							onSubmit={onSearch}
							isDisabled={isSearchDisabled}
							activeMode={activeMode}
							onModeChange={onModeChange}
							activeSource={activeSource}
							onSourceChange={onSourceChange}
						/>
					</div>
				</main>
			</div>
		</div>
	);
}
