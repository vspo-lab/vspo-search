type HomeHeaderPresenterProps = {
	title?: string;
	subtitle?: string;
};

export function HomeHeaderPresenter({
	title = "ぶいすぽコレクション",
	subtitle = "お気に入りの音声を集めよう",
}: HomeHeaderPresenterProps) {
	return (
		<div className="flex flex-col gap-1 px-5 pt-14">
			<h1 className="text-[22px] font-bold leading-[1.2] tracking-[0.02em] text-foreground">
				{title}
			</h1>
			<p className="text-[13px] leading-[1.2] text-text-muted">{subtitle}</p>
		</div>
	);
}
