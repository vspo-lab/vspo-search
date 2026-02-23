import { createFileRoute } from "@tanstack/react-router";
import { mockPlaylists } from "@/features/collection/__mocks__/fixtures";
import { PlaylistPagePresenter } from "@/features/collection/components/presenters/PlaylistPagePresenter";

export const Route = createFileRoute("/_collection/lists")({
	component: PlaylistPage,
});

function PlaylistPage() {
	return <PlaylistPagePresenter playlists={mockPlaylists} />;
}
