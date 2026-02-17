import { SlidersHorizontal, X } from "lucide-react";
import { Chip } from "@/shared/components/ui/Chip";
import { DateInput } from "@/shared/components/ui/DateInput";
import { TypeToggle } from "@/shared/components/ui/TypeToggle";
import { cn } from "@/shared/lib/utils";
import type {
	Channel,
	DataSource,
	FilterState,
	OutputMode,
} from "../../types/domain";

type SidebarPresenterProps = {
	channels: Channel[];
	filters: FilterState;
	isOpen?: boolean;
	onClose?: () => void;
	onChannelToggle?: (channelId: string) => void;
	onTypeToggle?: (type: "stream" | "clip") => void;
	onDateChange?: (field: "start" | "end", value: string) => void;
	onDataSourceChange?: (source: DataSource) => void;
	onOutputModeChange?: (mode: OutputMode) => void;
};

const DATA_SOURCES: { value: DataSource; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "youtube", label: "YouTube" },
	{ value: "x", label: "X" },
];

const OUTPUT_MODES: { value: OutputMode; label: string; desc: string }[] = [
	{
		value: "search",
		label: "Video Search",
		desc: "該当動画とタイムスタンプを表示",
	},
	{
		value: "answer",
		label: "Follow-up Answer",
		desc: "根拠引用付きで回答を生成",
	},
	{
		value: "analysis",
		label: "Analysis",
		desc: "傾向・比較・話題の分布を可視化",
	},
];

export function SidebarPresenter({
	channels,
	filters,
	isOpen = false,
	onClose,
	onChannelToggle,
	onTypeToggle,
	onDateChange,
	onDataSourceChange,
	onOutputModeChange,
}: SidebarPresenterProps) {
	const isAllSelected = filters.selectedChannels.length === 0;

	return (
		<>
			{/* Overlay (mobile) */}
			<div
				className={cn(
					"fixed inset-0 z-[200] bg-black/30 transition-opacity duration-[var(--dur-md)] ease-[var(--ease)] md:hidden",
					isOpen ? "block opacity-100" : "hidden opacity-0",
				)}
				onClick={onClose}
			/>

			{/* Sidebar */}
			<aside
				className={cn(
					"w-[280px] shrink-0 overflow-y-auto border-r border-border bg-surface p-6 pr-5",
					"transition-transform duration-[var(--dur-md)] ease-[var(--ease)]",
					"max-md:fixed max-md:top-0 max-md:left-0 max-md:bottom-0 max-md:z-[201] max-md:w-[280px] max-md:shadow-[var(--shadow-card)]",
					isOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
				)}
				role="complementary"
				aria-label="Search and analysis filters"
			>
				{/* Close button (mobile) */}
				<button
					type="button"
					onClick={onClose}
					aria-label="閉じる"
					className={cn(
						"absolute right-4 top-4 hidden max-md:flex",
						"h-8 w-8 items-center justify-center",
						"rounded-sm border-0 bg-surface-warm text-ink-muted",
						"focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2",
					)}
				>
					<X className="h-4 w-4" />
				</button>

				{/* Title */}
				<div className="mb-5 flex items-center gap-2 text-[0.8rem] uppercase tracking-widest text-ink-muted">
					<SlidersHorizontal className="h-4 w-4" />
					search controls
				</div>

				{/* Data Source */}
				<FilterSection label="Data Source">
					<div className="flex flex-wrap gap-1.5">
						{DATA_SOURCES.map((src) => (
							<Chip
								key={src.value}
								label={src.label}
								isActive={filters.dataSource === src.value}
								onClick={() =>
									onDataSourceChange?.(src.value)
								}
							/>
						))}
					</div>
				</FilterSection>

				{/* Search Scope */}
				<FilterSection label="Search Scope">
					<div className="flex gap-1.5">
						<TypeToggle
							videoType="stream"
							label="配信"
							isActive={filters.videoTypes.stream}
							onClick={() => onTypeToggle?.("stream")}
						/>
						<TypeToggle
							videoType="clip"
							label="切り抜き"
							isActive={filters.videoTypes.clip}
							onClick={() => onTypeToggle?.("clip")}
						/>
					</div>
				</FilterSection>

				{/* Output Mode */}
				<FilterSection label="Output Mode">
					<div className="flex flex-col gap-1.5">
						{OUTPUT_MODES.map((mode) => (
							<button
								key={mode.value}
								type="button"
								onClick={() =>
									onOutputModeChange?.(mode.value)
								}
								className={cn(
									"rounded-md border p-2.5 text-left",
									"transition-all duration-[var(--dur-fast)] ease-[var(--ease)]",
									filters.outputMode === mode.value
										? "border-[var(--accent-alpha-34)] bg-[var(--accent-alpha-08)]"
										: "border-border bg-surface hover:bg-surface-soft",
									"focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2",
								)}
							>
								<span className="block text-[0.78rem] font-bold text-ink-soft">
									{mode.label}
								</span>
								<span className="block text-[0.66rem] text-ink-muted">
									{mode.desc}
								</span>
							</button>
						))}
					</div>
				</FilterSection>

				{/* Members */}
				<FilterSection label="Members">
					<div className="flex flex-wrap gap-1.5">
						<Chip
							label="すべて"
							isActive={isAllSelected}
							onClick={() => onChannelToggle?.("")}
						/>
						{channels.map((ch) => (
							<Chip
								key={ch.id}
								label={ch.name}
								colorDot={ch.colorHex}
								isActive={filters.selectedChannels.includes(
									ch.id,
								)}
								onClick={() => onChannelToggle?.(ch.id)}
							/>
						))}
					</div>
				</FilterSection>

				{/* Date Range */}
				<FilterSection label="Date Range">
					<div className="flex flex-col gap-2">
						<DateInput
							label="From"
							value={filters.dateRange.start ?? ""}
							onChange={(v) => onDateChange?.("start", v)}
						/>
						<DateInput
							label="To"
							value={filters.dateRange.end ?? ""}
							onChange={(v) => onDateChange?.("end", v)}
						/>
					</div>
				</FilterSection>
			</aside>
		</>
	);
}

function FilterSection({
	label,
	children,
}: { label: string; children: React.ReactNode }) {
	return (
		<div className="mb-5">
			<span className="mb-2 block text-[0.72rem] text-ink-soft">
				{label}
			</span>
			{children}
		</div>
	);
}
