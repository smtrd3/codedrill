import { createServerFn } from "@tanstack/react-start";
import { last, map } from "lodash-es";
import { getDB } from "~/components/database";

export const getItem = createServerFn()
  .validator((input: { id: string | number }) => input)
  .handler(async (ctx) => {
    const db = await getDB("demo_user");
    const item = await db.get(ctx.data.id);
    return item;
  });

export const updateItem = createServerFn()
  .validator((input: any) => input)
  .handler(async (ctx) => {
    const db = await getDB("demo_user");
    const item = await db.update(ctx.data);
    return item;
  });

export const putItem = createServerFn()
  .validator((input: any) => input)
  .handler(async (ctx) => {
    const db = await getDB("demo_user");
    const item = await db.put(ctx.data);
    return item;
  });

export const deleteItem = createServerFn()
  .validator((input: { id: string | number }) => input)
  .handler(async (ctx) => {
    const db = await getDB("demo_user");
    const item = await db.delete(ctx.data.id);
    return item;
  });

export const getAllItems = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = await getDB("demo_user");
    const kvs = (await db.getAll()) as [string, unknown][];
    return map(kvs, (value) => last(value)) as any[];
  },
);

export const upsert = createServerFn()
  .validator((input: any) => input)
  .handler(async (ctx) => {
    const db = await getDB("demo_user");
    const item = await db.upsert(ctx.data);
    return item;
  });

export const DAO = {
  getAll() {
    return getAllItems();
  },
  get(id: string | number) {
    return getItem({ data: { id } });
  },
  put(item: any) {
    return putItem({ data: item });
  },
  update(item: any) {
    return updateItem({ data: item });
  },
  delete(id: string | number) {
    return deleteItem({ data: { id } });
  },
  upsert(item: any) {
    return upsert(item);
  },
};
