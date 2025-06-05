import { createServerFn } from '@tanstack/react-start';
import { eq, and } from 'drizzle-orm';
import { unset } from 'lodash-es';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { db } from '~/db/connection';
import { templates } from '~/db/schema';

export const createTemplate = createServerFn()
  .validator((input: any) => {
    const schema = z.object({
      title: z.string().max(255),
      template: z.string().max(8000),
    });

    return schema.parse(input);
  })
  .handler(async ctx => {
    // TODO: add real user id
    const result = await db
      .insert(templates)
      .values({ ...ctx.data, uuid: nanoid(), userId: 'demo_user' });

    if (result.lastInsertRowid) {
      const results = await db
        .select()
        .from(templates)
        .where(eq(templates.id, Number(result.lastInsertRowid)));

      return results.at(0);
    } else {
      throw new Error('Failed to create template');
    }
  });

export const getUserTemplates = createServerFn({ method: 'GET' }).handler(
  async () => {
    const userId = 'demo_user';
    return db.select().from(templates).where(eq(templates.userId, userId));
  }
);

export const getTemplate = createServerFn()
  .validator((input: { id: string }) => input)
  .handler(async ctx => {
    const rows = await db
      .select()
      .from(templates)
      .where(
        and(eq(templates.uuid, ctx.data.id), eq(templates.userId, 'demo_user'))
      );

    return rows.at(0);
  });

export const updateTemplate = createServerFn()
  .validator((input: any) => {
    const schema = z.object({
      id: z.number().optional(),
      uuid: z.string(),
      title: z.string().max(255),
      template: z.string().max(8000),
      count: z.number().optional(),
      totalTime: z.number().optional(),
    });

    return schema.parse(input);
  })
  .handler(async ctx => {
    const userId = 'demo_user';
    const queryId = ctx.data.uuid;
    unset(ctx.data, 'id'); // remove id from the data as it violates the unique constraint
    unset(ctx.data, 'uuid'); // remove uuid from the data as it violates the unique constraint

    console.log(ctx.data, queryId);

    await db
      .update(templates)
      .set(ctx.data)
      .where(and(eq(templates.uuid, queryId), eq(templates.userId, userId)));

    return ctx.data;
  });

export const deleteItem = createServerFn()
  .validator((input: { id: string | number }) => input)
  .handler(async ctx => {
    const userId = 'demo_user';
    await db
      .delete(templates)
      .where(
        and(
          eq(templates.uuid, ctx.data.id.toString()),
          eq(templates.userId, userId)
        )
      );
    return { success: true, deletedId: ctx.data.id };
  });

export const upsert = createServerFn()
  .validator((input: any) => input)
  .handler(async ctx => {
    return { success: true, upsertedId: ctx.data.id };
  });

export const DAO = {
  getUserTemplates() {
    return getUserTemplates();
  },
  getTemplate(id: string) {
    return getTemplate({ data: { id } });
  },
  updateTemplate(item: {
    uuid: string;
    title: string;
    template: string;
    count?: number;
    totalTime?: number;
  }) {
    return updateTemplate({ data: item });
  },
  deleteTemplate(id: string | number) {
    return deleteItem({ data: { id } });
  },
  createTemplate(item: { title: string; template: string }) {
    return createTemplate({ data: item });
  },
};
