import { Tooltip } from '@radix-ui/themes';
import ActivityCalendar from 'react-activity-calendar';
import { DAO } from '~/utils/dao';
import { useQuery } from '@tanstack/react-query';
import { map } from 'lodash-es';
import { memo } from 'react';

function getLevel(count: number) {
  if (count < 1) return 0;
  if (count < 10) return 1;
  if (count < 20) return 2;
  return 3;
}

const theme = ['rgba(255, 255, 255, 0.05)', 'rgba(46, 204, 113, 1)'];

export const DailyActivity = memo(function DailyActivityImpl() {
  const { data: activityData, isLoading } = useQuery({
    queryKey: ['daily-activity'],
    queryFn: async () => {
      const data = await DAO.getDailyActivity();

      return map(data, item => ({
        date: item.date,
        count: item.count,
        level: getLevel(item.count),
      }));
    },
  });

  return (
    <ActivityCalendar
      maxLevel={4}
      loading={isLoading}
      data={activityData ?? []}
      theme={{
        light: theme,
        dark: theme,
      }}
      blockSize={12}
      blockRadius={14}
      renderBlock={(block, activity) => {
        return (
          <Tooltip
            content={
              <span className="font-sans font-bold">
                {activity.count} activities on {activity.date}
              </span>
            }
          >
            {block}
          </Tooltip>
        );
      }}
    />
  );
});
