import { createServerFn } from '@tanstack/react-start';
import { eq, and } from 'drizzle-orm';
import { unset } from 'lodash-es';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { db } from '~/db/connection';
import { activity, templates } from '~/db/schema';
import { getUserId } from './server';

const createTemplate = createServerFn()
  .validator((input: any) => {
    const schema = z.object({
      title: z.string().max(255),
      template: z.string().max(8000),
    });

    return schema.parse(input);
  })
  .handler(async ctx => {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not found');
    }

    const result = await db
      .insert(templates)
      .values({ ...ctx.data, uuid: nanoid(), userId });

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

const getUserTemplates = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await getUserId();
  if (!userId) {
    throw new Error('User not found');
  }

  return db.select().from(templates).where(eq(templates.userId, userId));
});

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

const updateTemplate = createServerFn()
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
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not found');
    }

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

const deleteItem = createServerFn()
  .validator((input: { id: string | number }) => input)
  .handler(async ctx => {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not found');
    }

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

const updateStats = createServerFn()
  .validator((input: any) => {
    const schema = z.object({
      time: z.number(),
      mistakes: z.number(),
      wpm: z.number(),
      accuracy: z.number(),
    });

    return schema.parse(input);
  })
  .handler(async ctx => {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not found');
    }

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const statsData = ctx.data;

    const existingActivity = await db
      .select()
      .from(activity)
      .where(and(eq(activity.userId, userId), eq(activity.date, today)))
      .limit(1);

    if (existingActivity.length > 0) {
      const current = existingActivity[0];
      const newBestTime =
        statsData.time > 0 &&
        (current.bestTime === 0 || statsData.time < current.bestTime)
          ? Math.trunc(statsData.time)
          : current.bestTime;

      const result = await db
        .update(activity)
        .set({
          count: current.count + 1,
          bestAccuracy: Math.max(current.bestAccuracy, statsData.accuracy),
          bestWpm: Math.max(current.bestWpm, Math.trunc(statsData.wpm)),
          bestTime: newBestTime,
        })
        .where(and(eq(activity.userId, userId), eq(activity.date, today)))
        .returning();
      return result.at(0);
    } else {
      const result = await db
        .insert(activity)
        .values({
          userId,
          date: today,
          count: 1,
          bestAccuracy: statsData.accuracy,
          bestWpm: Math.trunc(statsData.wpm),
          bestTime: Math.trunc(statsData.time),
        })
        .returning();
      return result.at(0);
    }
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
  updateStats(stats: {
    time: number;
    mistakes: number;
    wpm: number;
    accuracy: number;
  }) {
    return updateStats({ data: stats });
  },
};
