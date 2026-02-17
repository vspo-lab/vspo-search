import { Send } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { DataSource, OutputMode } from "../../types/domain";

const MODE_OPTIONS: { value: OutputMode; label: string }[] = [
	{ value: "search", label: "検索" },
	{ value: "answer", label: "回答生成" },
	{ value: "analysis", label: "分析" },
];

const SOURCE_OPTIONS: { value: DataSource; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "youtube", label: "YouTube" },
	{ value: "x", label: "X" },
];

type ChatInputPresenterProps = {
	value: string;
	placeholder?: string;
	onChange?: (value: string) => void;
	onSubmit?: () => void;
	isDisabled?: boolean;
	activeMode?: OutputMode;
	onModeChange?: (mode: OutputMode) => void;
	activeSource?: DataSource;
	onSourceChange?: (source: DataSource) => void;
};

export function ChatInputPresenter({
	value,
	placeholder = "例: 大会前日の配信内容とXの反応をまとめて",
	onChange,
	onSubmit,
	isDisabled = false,
	activeMode = "search",
	onModeChange,
	activeSource = "all",
	onSourceChange,
}: ChatInputPresenterProps) {
	return (
		<div>
			{/* Mode toolbar */}
			<div className="mb-2 flex flex-wrap gap-1.5" aria-label="output mode">
				{MODE_OPTIONS.map((opt) => (
					<button
						key={opt.value}
						type="button"
						onClick={() => onModeChange?.(opt.value)}
						className={cn(
							"rounded-full border px-2.5 py-1 text-[0.7rem]",
							"transition-all duration-[var(--dur-fast)] ease-[var(--ease)]",
							activeMode === opt.value
								? "border-[var(--accent-alpha-34)] bg-[var(--accent-alpha-08)] text-accent-text"
								: "border-border bg-surface text-ink-soft hover:border-border-strong hover:bg-surface-soft",
							"focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2",
						)}
					>
						{opt.label}
					</button>
				))}
			</div>

			{/* Source chips */}
			<div className="mb-2 flex flex-wrap gap-1.5" aria-label="data source">
				{SOURCE_OPTIONS.map((opt) => (
					<button
						key={opt.value}
						type="button"
						onClick={() => onSourceChange?.(opt.value)}
						className={cn(
							"rounded-full border px-2.5 py-1 text-[0.7rem]",
							"transition-all duration-[var(--dur-fast)] ease-[var(--ease)]",
							activeSource === opt.value
								? "border-ink bg-ink text-white"
								: "border-border bg-surface text-ink-soft hover:border-border-strong hover:bg-surface-soft",
							"focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2",
						)}
					>
						{opt.label}
					</button>
				))}
			</div>

			{/* Input box */}
			<div
				className={cn(
					"flex items-center gap-2.5",
					"rounded-2xl border-[1.5px] border-border-strong bg-surface",
					"py-1.5 pr-1.5 pl-5",
					"shadow-[var(--shadow-card)]",
					"transition-[border-color] duration-[var(--dur-fast)] ease-[var(--ease)]",
					"focus-within:border-ink-muted focus-within:shadow-[var(--shadow-focus)]",
				)}
			>
				<input
					type="text"
					value={value}
					onChange={(e) => onChange?.(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !isDisabled) {
							e.preventDefault();
							onSubmit?.();
						}
					}}
					placeholder={isDisabled ? "準備中..." : placeholder}
					disabled={isDisabled}
					aria-label="質問を入力"
					className={cn(
						"flex-1 border-0 bg-transparent py-2 font-body text-[0.92rem] text-ink outline-none",
						"placeholder:text-grey",
						"disabled:cursor-not-allowed disabled:opacity-50",
					)}
				/>
				<button
					type="button"
					onClick={onSubmit}
					disabled={isDisabled}
					aria-label="送信"
					className={cn(
						"flex h-11 w-11 shrink-0 items-center justify-center",
						"rounded-full bg-[linear-gradient(140deg,var(--brand-grad-start),var(--brand-grad-end))] text-white",
						"shadow-[var(--shadow-soft)]",
						"transition-all duration-[var(--dur-fast)] ease-[var(--ease)]",
						"hover:scale-105",
						"active:scale-95",
						"disabled:opacity-50 disabled:hover:scale-100",
						"focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)]",
					)}
				>
					<Send className="ml-0.5 h-[18px] w-[18px]" />
				</button>
			</div>

			{/* Keyboard hints (hidden on mobile) */}
			<div className="mt-2.5 hidden items-center justify-center gap-4 text-[0.7rem] text-ink-muted md:flex">
				<span className="flex items-center gap-1">
					<kbd className="rounded border border-border-strong bg-surface px-1.5 py-0.5 font-body text-[0.65rem] text-ink-muted">
						Enter
					</kbd>{" "}
					送信
				</span>
				<span>AND / OR で条件指定</span>
				<span>データソースを切り替えて検索範囲を制御</span>
			</div>
		</div>
	);
}
