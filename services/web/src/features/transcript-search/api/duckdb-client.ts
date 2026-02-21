import * as duckdb from "@duckdb/duckdb-wasm";
import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import mvp_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import eh_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
	mvp: { mainModule: duckdb_wasm, mainWorker: mvp_worker },
	eh: { mainModule: duckdb_wasm_eh, mainWorker: eh_worker },
};

let dbPromise: Promise<duckdb.AsyncDuckDB> | null = null;

async function createDuckDB(): Promise<duckdb.AsyncDuckDB> {
	const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
	if (!bundle.mainWorker) {
		throw new Error(
			"DuckDB-WASM: no compatible worker bundle for this browser",
		);
	}
	const worker = new Worker(bundle.mainWorker);
	const logger = new duckdb.ConsoleLogger();
	const db = new duckdb.AsyncDuckDB(logger, worker);
	await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
	return db;
}

/** Initialize DuckDB-WASM singleton. Browser-only. Concurrent-safe. */
export function initDuckDB(): Promise<duckdb.AsyncDuckDB> {
	if (typeof window === "undefined") {
		throw new Error("DuckDB-WASM can only be initialized in the browser");
	}
	if (!dbPromise) {
		dbPromise = createDuckDB();
	}
	return dbPromise;
}

/** Tear down the DuckDB instance and release resources. */
export async function terminateDuckDB(): Promise<void> {
	if (!dbPromise) return;
	const db = await dbPromise;
	await db.terminate();
	dbPromise = null;
}
