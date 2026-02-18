import { cn } from "@/shared/lib/utils";
import type { XPostCard } from "../../types/domain";

type XPostCardPresenterProps = {
	post: XPostCard;
};

export function XPostCardPresenter({ post }: XPostCardPresenterProps) {
	return (
		<div
			className={cn(
				"rounded-md border border-border border-l-[3px] border-l-source-x bg-surface p-3",
				"transition-all duration-[var(--dur-fast)] ease-[var(--ease)]",
				"hover:border-border-strong hover:border-l-source-x hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5",
			)}
			role="article"
		>
			{/* Header */}
			<div className="mb-1.5 flex items-baseline justify-between gap-2">
				<div className="flex items-baseline gap-1.5">
					<span className="text-[0.76rem] font-bold text-ink">
						{post.authorName}
					</span>
					<span className="text-[0.68rem] font-bold text-source-x">
						𝕏
					</span>
					<span className="text-[0.68rem] text-ink-muted">
						{post.authorHandle}
					</span>
				</div>
				<span className="shrink-0 text-[0.66rem] text-ink-muted">
					{post.postedAt}
				</span>
			</div>

			{/* Post text */}
			<p
				className="text-[0.76rem] leading-relaxed text-ink-soft"
				dangerouslySetInnerHTML={{ __html: post.highlightedText }}
			/>

			{/* Footer */}
			<div className="mt-2 flex flex-wrap items-center gap-2 text-[0.68rem] text-ink-muted">
				<span className="rounded-full border border-[rgb(29_155_240_/_0.2)] bg-surface-soft px-2 py-0.5 text-[#1270b0]">
					Like {post.likeCount.toLocaleString()}
				</span>
				<span className="rounded-full border border-[rgb(29_155_240_/_0.2)] bg-surface-soft px-2 py-0.5 text-[#1270b0]">
					Repost {post.repostCount.toLocaleString()}
				</span>
				<a
					href={post.permalink}
					className={cn(
						"ml-auto text-[0.66rem] text-accent-text no-underline",
						"hover:underline",
						"focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-1 focus-visible:rounded-sm",
					)}
					target="_blank"
					rel="noopener noreferrer"
				>
					open post
				</a>
			</div>
		</div>
	);
}
