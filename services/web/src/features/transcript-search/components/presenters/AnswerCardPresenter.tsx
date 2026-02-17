import { Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { FollowUpAnswer } from "../../types/domain";

type AnswerCardPresenterProps = {
	answer: FollowUpAnswer;
};

export function AnswerCardPresenter({ answer }: AnswerCardPresenterProps) {
	return (
		<div
			className={cn(
				"rounded-md border border-[var(--accent-alpha-34)]",
				"bg-[var(--accent-alpha-08)] p-3.5",
			)}
		>
			{/* Title */}
			<div className="mb-1.5 flex items-center gap-1.5 text-[0.82rem] font-bold text-accent-text">
				<Sparkles className="h-4 w-4 opacity-80" />
				{answer.title}
			</div>

			{/* Body */}
			<p className="text-[0.8rem] leading-relaxed text-accent-text/90">
				{answer.body}
			</p>

			{/* Citations */}
			{answer.citations.length > 0 && (
				<div className="mt-2.5 flex flex-col gap-1.5">
					{answer.citations.map((citation) => (
						<div
							key={citation.label}
							className={cn(
								"rounded-sm border border-[var(--accent-alpha-22)]",
								"bg-white/60 px-2.5 py-1.5",
								"text-[0.72rem] text-accent-text/90",
							)}
						>
							<span
								className={cn(
									"mr-1.5 inline-block rounded-sm px-1 py-px text-[0.62rem] font-bold uppercase",
									citation.sourceType === "youtube"
										? "bg-ink/10 text-ink-soft"
										: "bg-ink/10 text-ink-soft",
								)}
							>
								{citation.sourceType === "youtube"
									? "YouTube"
									: "X"}
							</span>
							{citation.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
