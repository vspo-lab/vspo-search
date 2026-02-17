import { cn } from "@/shared/lib/utils";
import type { AnalysisData } from "../../types/domain";

type AnalysisSectionPresenterProps = {
	analysis: AnalysisData;
};

export function AnalysisSectionPresenter({
	analysis,
}: AnalysisSectionPresenterProps) {
	return (
		<div>
			{/* Metric cards */}
			{analysis.cards.length > 0 && (
				<div
					className={cn(
						"mb-2.5 grid gap-2",
						"grid-cols-1 sm:grid-cols-3",
					)}
				>
					{analysis.cards.map((card) => (
						<div
							key={card.label}
							className="rounded-sm border border-border bg-surface p-2.5"
						>
							<span className="block text-[0.66rem] text-ink-muted">
								{card.label}
							</span>
							<strong className="mt-0.5 block text-[0.92rem] text-ink">
								{card.value}
							</strong>
						</div>
					))}
				</div>
			)}

			{/* Bar chart */}
			{analysis.bars.length > 0 && (
				<div className="flex flex-col gap-1.5">
					{analysis.bars.map((bar) => (
						<div
							key={bar.label}
							className="grid grid-cols-[96px_minmax(0,1fr)_40px] items-center gap-2 text-[0.72rem] text-ink-soft"
						>
							<span className="truncate">{bar.label}</span>
							<div className="h-[7px] w-full overflow-hidden rounded-full bg-surface-soft">
								<div
									className="h-full rounded-full bg-[linear-gradient(90deg,var(--brand-grad-end),var(--brand-grad-start))]"
									style={{ width: `${bar.percentage}%` }}
								/>
							</div>
							<span className="text-right tabular-nums">
								{bar.percentage}%
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
