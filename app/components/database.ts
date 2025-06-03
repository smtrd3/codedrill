import { castArray, join } from "lodash-es";
import { LevelDBClient } from "~/lib/server/leveldb";
import { nanoid } from "nanoid";

export type DbInterface = {
  getAll: () => unknown;
  get: (id: string | number) => unknown;
  put: (item: unknown) => void;
  update: (item: unknown) => void;
  delete: (id: string | number) => void;
};

const _db: Map<string, DbInterface> = new Map();

export async function getDB(userId: string): Promise<DbInterface> {
  if (_db.has(userId)) return _db.get(userId)!;

  const client = new LevelDBClient(process.env.KV_PATH!);

  function _key(key: string | number | (string | number)[]) {
    return join([userId, ...castArray(key)], ".");
  }

  _db.set(userId, {
    async getAll() {
      const it = client.prefix(userId);
      const items: unknown[] = [];

      for await (const [key, value] of it) {
        items.push([key, value]);
      }

      return items;
    },
    async get(id) {
      return await client.get(_key(id));
    },
    async put(data: unknown) {
      const uid = nanoid();
      return await client.put(_key(uid), { ...(data as Record<string, unknown>), id: uid });
    },
    async update(item) {
      const { id } = item as Record<string, unknown>;
      return await client.put(_key(id as string), item);
    },
    async delete(id) {
      return await client.del(_key(id));
    },
  });

  return _db.get(userId)!;
}
