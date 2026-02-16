import { AppError, Err, Ok } from "@vspo/errors";
import { describe, expect, it, vi } from "vitest";
import { TranscriptUseCase } from "./transcript";

describe("TranscriptUseCase", () => {
	it("delegates fetch and saveRaw to injected ports", async () => {
		const fetchResult = Ok('{"events":[]}');
		const saveResult = Ok({ key: "transcripts/raw/abc/ja.json" });
		const fetch = vi.fn().mockResolvedValue(fetchResult);
		const saveRaw = vi.fn().mockResolvedValue(saveResult);

		const usecase = TranscriptUseCase.from({
			source: { fetch },
			store: { saveRaw },
		});

		const fetched = await usecase.fetch({ videoId: "abc", lang: "ja" });
		const saved = await usecase.saveRaw(
			{ videoId: "abc", lang: "ja" },
			'{"events":[]}',
		);

		expect(fetch).toHaveBeenCalledWith({ videoId: "abc", lang: "ja" });
		expect(saveRaw).toHaveBeenCalledWith(
			{ videoId: "abc", lang: "ja" },
			'{"events":[]}',
		);
		expect(fetched).toBe(fetchResult);
		expect(saved).toBe(saveResult);
	});

	it("passes through port errors without mutation", async () => {
		const fetchError = Err(
			new AppError({
				code: "INTERNAL_SERVER_ERROR",
				message: "fetch failed",
			}),
		);
		const saveError = Err(
			new AppError({
				code: "INTERNAL_SERVER_ERROR",
				message: "save failed",
			}),
		);

		const usecase = TranscriptUseCase.from({
			source: { fetch: vi.fn().mockResolvedValue(fetchError) },
			store: { saveRaw: vi.fn().mockResolvedValue(saveError) },
		});

		const fetched = await usecase.fetch({ videoId: "abc", lang: "ja" });
		const saved = await usecase.saveRaw(
			{ videoId: "abc", lang: "ja" },
			"raw",
		);

		expect(fetched).toBe(fetchError);
		expect(saved).toBe(saveError);
	});
});
