import { z } from 'zod';
import { db } from '~/db/connection';
import { nanoid } from 'nanoid';
import { getUserId } from './server';
import { get, unset } from 'lodash-es';
import { createServerFn } from '@tanstack/react-start';
import { eq, and, gte, lte, max, min, sql } from 'drizzle-orm';
import { activity, metadata, templates } from '~/db/schema';
import { authMiddleware } from '~/middleware/auth.middleware';
import { SAMPLE_TEMPLATES } from '~/app.constants';

const createTemplate = createServerFn()
  .middleware([authMiddleware])
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

const getUserTemplates = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not found');
    }

    return db.select().from(templates).where(eq(templates.userId, userId));
  });

export const getTemplate = createServerFn()
  .middleware([authMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ctx => {
    const userId = (await getUserId()) || '';
    const rows = await db
      .select()
      .from(templates)
      .where(
        and(eq(templates.uuid, ctx.data.id), eq(templates.userId, userId))
      );

    return rows.at(0);
  });

const updateTemplate = createServerFn()
  .middleware([authMiddleware])
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
  .middleware([authMiddleware])
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
  .middleware([authMiddleware])
  .validator((input: any) => {
    const schema = z.object({
      uuid: z.string(),
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

    const template = await db
      .select()
      .from(templates)
      .where(eq(templates.uuid, ctx.data.uuid));

    if (!template.length) {
      throw new Error('Template not found');
    }

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const statsData = ctx.data;

    const existingActivity = await db
      .select()
      .from(activity)
      .where(and(eq(activity.userId, userId), eq(activity.date, today)))
      .limit(1);

    const templateData = template[0];
    const activityData = existingActivity[0];

    await db.transaction(async tx => {
      await tx
        .update(templates)
        .set({
          count: templateData.count + 1,
          totalTime: templateData.totalTime + statsData.time,
          bestWpm: Math.max(templateData.bestWpm, Math.trunc(statsData.wpm)),
        })
        .where(eq(templates.uuid, ctx.data.uuid));

      if (activityData) {
        await tx
          .update(activity)
          .set({
            count: activityData.count + 1,
            bestAccuracy: Math.max(
              activityData.bestAccuracy,
              statsData.accuracy
            ),
            bestWpm: Math.max(activityData.bestWpm, Math.trunc(statsData.wpm)),
            bestTime: Math.min(activityData.bestTime, statsData.time),
          })
          .where(and(eq(activity.userId, userId!), eq(activity.date, today)));
      } else {
        await tx.insert(activity).values({
          userId: userId!,
          date: today,
          count: 1,
        });
      }
    });
  });

const getDailyActivity = createServerFn()
  .middleware([authMiddleware])
  .handler(async () => {
    const userId = (await getUserId()) as string;
    const thisYear = new Date().getFullYear();

    const activities = await db
      .select({
        date: activity.date,
        count: sql<number>`sum(${activity.count})`,
        bestAccuracy: max(activity.bestAccuracy),
        bestWpm: max(activity.bestWpm),
        bestTime: min(activity.bestTime),
      })
      .from(activity)
      .where(
        and(
          eq(activity.userId, userId),
          gte(activity.date, `${thisYear}-01-01`),
          lte(activity.date, `${thisYear}-12-31`)
        )
      )
      .groupBy(activity.date);

    // append empty data for first and last day of the year
    const firstDay = `${thisYear}-01-01`;
    const lastDay = `${thisYear}-12-31`;

    if (get(activities[0], 'date') !== firstDay) {
      activities.unshift({
        date: firstDay,
        count: 0,
        bestAccuracy: 0,
        bestWpm: 0,
        bestTime: 0,
      });
    }

    if (get(activities[activities.length - 1], 'date') !== lastDay) {
      activities.push({
        date: lastDay,
        count: 0,
        bestAccuracy: 0,
        bestWpm: 0,
        bestTime: 0,
      });
    }

    return activities;
  });

export const createInitialTemplates = createServerFn()
  // .middleware([authMiddleware])
  .validator((input: any) => {
    const schema = z.object({
      userId: z.string(),
    });

    return schema.parse(input);
  })
  .handler(async ctx => {
    const userId = ctx.data.userId;
    // check if this user already exists in the database
    const onboardingComplete = await db
      .select()
      .from(metadata)
      .where(
        and(eq(metadata.userId, userId), eq(metadata.key, 'onboardingComplete'))
      );

    if (onboardingComplete.length > 0) {
      console.log('Templates already created');
      return;
    }

    await db.insert(metadata).values({
      userId,
      key: 'onboardingComplete',
      value: '1',
    });

    const sampleTemplates = SAMPLE_TEMPLATES;

    await db.insert(templates).values(
      sampleTemplates.map((template: any) => ({
        ...template,
        userId,
        uuid: nanoid(),
      }))
    );
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
    uuid: string;
    time: number;
    mistakes: number;
    wpm: number;
    accuracy: number;
  }) {
    return updateStats({ data: stats });
  },
  getDailyActivity() {
    return getDailyActivity();
  },
};
