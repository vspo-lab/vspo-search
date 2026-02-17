import { BarChart3, FileSearch, MessageCircle, Share2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/Badge";

export function HeroPresenter() {
	return (
		<section className="relative px-6 pb-7 pt-10 text-center">
			{/* Radial glow background */}
			<div className="pointer-events-none absolute -top-5 left-1/2 h-80 w-80 -translate-x-1/2 bg-[radial-gradient(circle,rgb(171_125_66_/_0.12)_0%,transparent_70%)]" />

			{/* Brand name — large pop gothic */}
			<div className="relative mb-2 font-body text-[clamp(2rem,5vw,3.2rem)] font-bold leading-tight tracking-wide">
				ぶいすぽ
				<span className="text-accent">っ!</span>
				サーチ
			</div>

			{/* Tagline */}
			<h1 className="relative mb-2 font-display text-[clamp(1.1rem,2vw,1.4rem)] font-semibold text-ink-soft max-md:text-base">
				<span className="relative inline-block">
					あの動画
					<span className="absolute -left-1 -right-1 bottom-1 -z-10 h-2.5 rounded-sm bg-accent/20" />
				</span>
				どこだっけ？を、その先まで。
			</h1>

			{/* Subtitle */}
			<p className="mx-auto mb-3.5 max-w-lg text-[0.88rem] leading-relaxed text-ink-muted max-md:text-[0.82rem]">
				動画検索に加えて、フォローアップ回答生成と横断分析を同じ会話画面で実行
			</p>

			{/* Feature badges */}
			<div className="flex flex-wrap items-center justify-center gap-2">
				<Badge variant="accent" icon={<FileSearch />}>
					Transcript Search
				</Badge>
				<Badge icon={<Share2 />}>X Signal Retrieval</Badge>
				<Badge icon={<MessageCircle />}>Follow-up Answer</Badge>
				<Badge icon={<BarChart3 />}>Cross Source Analysis</Badge>
			</div>
		</section>
	);
}
