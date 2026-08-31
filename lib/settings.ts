import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { SETTING_KEYS, SETTING_DEFAULTS, type SettingKey } from "./setting-constants";

export { SETTING_KEYS, SETTING_DEFAULTS, type SettingKey };

export const getSettings = unstable_cache(
  async (): Promise<Record<SettingKey, string>> => {
    try {
      const rows = await db.siteSetting.findMany();
      const result = { ...SETTING_DEFAULTS };
      for (const row of rows) {
        if (SETTING_KEYS.includes(row.key as SettingKey)) {
          result[row.key as SettingKey] = row.value;
        }
      }
      return result;
    } catch {
      return { ...SETTING_DEFAULTS };
    }
  },
  ["site-settings"],
  { revalidate: 3600, tags: ["settings"] }
);
