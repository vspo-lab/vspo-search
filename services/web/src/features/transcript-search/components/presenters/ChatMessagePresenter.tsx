import { motion } from "framer-motion";
import { Navigation, Search } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type {
	AnalysisData,
	FollowUpAnswer,
	SearchMessage,
	SystemMessage,
	VideoCard,
	XPostCard,
} from "../../types/domain";
import { AnalysisSectionPresenter } from "./AnalysisSectionPresenter";
import { AnswerCardPresenter } from "./AnswerCardPresenter";
import { VideoCardPresenter } from "./VideoCardPresenter";
import { XPostCardPresenter } from "./XPostCardPresenter";

type ChatMessagePresenterProps = {
	message: SearchMessage;
};

export function ChatMessagePresenter({ message }: ChatMessagePresenterProps) {
	if (message.type === "user") {
		return <UserMessageBubble content={message.content} />;
	}
	return <SystemMessageBubble message={message} />;
}

function UserMessageBubble({ content }: { content: string }) {
	return (
		<motion.div
			className="flex justify-end gap-2.5"
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
		>
			<div
				className={cn(
					"max-w-[720px] rounded-lg rounded-br-sm",
					"bg-ink px-[18px] py-3 text-[0.92rem] font-medium text-white",
				)}
			>
				{content}
			</div>
			<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[linear-gradient(140deg,var(--brand-grad-start),var(--brand-grad-end))] text-[0.75rem] font-bold text-white">
				U
			</div>
		</motion.div>
	);
}

function SystemMessageBubble({ message }: { message: SystemMessage }) {
	const hasXPosts = message.xPosts && message.xPosts.length > 0;
	const hasAnswer = message.answer != null;
	const hasAnalysis = message.analysis != null;
	const hasActions = message.followUpActions && message.followUpActions.length > 0;

	return (
		<motion.div
			className="flex justify-start gap-2.5"
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1], delay: 0.1 }}
		>
			<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-ink text-white">
				<Search className="h-4 w-4" />
			</div>
			<div
				className={cn(
					"max-w-[840px] rounded-lg rounded-bl-sm",
					"border border-border bg-surface px-5 py-4",
					"shadow-[var(--shadow-card)]",
				)}
			>
				{/* Result count header */}
				<div className="mb-4 flex items-center gap-1.5 text-[0.85rem] text-ink-muted">
					<Navigation className="h-3.5 w-3.5" />
					<strong className="font-bold text-ink">
						{message.resultCount}件
					</strong>
					見つかりました
				</div>

				{/* Search Results — YouTube */}
				{message.videos.length > 0 && (
					<ResultSection title="YouTube Matches">
						<div className="flex flex-col gap-2.5">
							{message.videos.map((video) => (
								<VideoCardPresenter
									key={video.id}
									video={video}
								/>
							))}
						</div>
					</ResultSection>
				)}

				{/* Search Results — X */}
				{hasXPosts && (
					<ResultSection title="X Matches">
						<div className="flex flex-col gap-2">
							{message.xPosts?.map((post) => (
								<XPostCardPresenter
									key={post.id}
									post={post}
								/>
							))}
						</div>
					</ResultSection>
				)}

				{/* Follow-up Answer */}
				{hasAnswer && (
					<ResultSection title="Follow-up Answer">
						<AnswerCardPresenter
							answer={message.answer as FollowUpAnswer}
						/>
					</ResultSection>
				)}

				{/* Analysis */}
				{hasAnalysis && (
					<ResultSection title="Analysis">
						<AnalysisSectionPresenter
							analysis={message.analysis as AnalysisData}
						/>
					</ResultSection>
				)}

				{/* Follow-up Actions */}
				{hasActions && (
					<ResultSection title="Next Actions">
						<div className="flex flex-wrap gap-1.5">
							{message.followUpActions?.map((action, i) => (
								<button
									key={action}
									type="button"
									className={cn(
										"rounded-full border px-3 py-1 text-[0.7rem]",
										"transition-all duration-[var(--dur-fast)] ease-[var(--ease)]",
										i === 0
											? "border-ink bg-ink text-white hover:bg-ink-soft"
											: "border-border bg-surface text-ink-soft hover:bg-surface-soft hover:border-border-strong",
										"focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2",
									)}
								>
									{action}
								</button>
							))}
						</div>
					</ResultSection>
				)}
			</div>
		</motion.div>
	);
}

function ResultSection({
	title,
	children,
}: { title: string; children: React.ReactNode }) {
	return (
		<section className="mb-3.5 border-t border-border pt-3 first:border-t-0 first:pt-0 last:mb-0">
			<h3 className="mb-2 text-[0.76rem] font-bold uppercase tracking-wider text-ink-muted">
				{title}
			</h3>
			{children}
		</section>
	);
}
