import { ScanConfig } from "./types";
import { runScan } from "./scan-engine";
import { updateScan, completeScan, failScan, pushEvent, updateProgress } from "./store";

const runningScanIds = new Set<string>();

export function startScanInBackground(config: ScanConfig) {
  if (runningScanIds.has(config.id)) return; // already running
  runningScanIds.add(config.id);

  (async () => {
    try {
      for await (const event of runScan(config)) {
        pushEvent(config.id, event);
        updateProgress(config.id, event.progress);
        if (event.moduleResult) {
          updateScan(config.id, event.moduleResult);
        }
      }
      updateProgress(config.id, 100);
      completeScan(config.id);
    } catch (err) {
      console.error(`Scan ${config.id} failed:`, err);
      pushEvent(config.id, {
        type: "scan-complete",
        message: `Error: ${String(err)}`,
        progress: 0,
      });
      failScan(config.id);
    } finally {
      runningScanIds.delete(config.id);
    }
  })();
}
