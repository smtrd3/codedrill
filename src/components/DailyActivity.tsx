import { Tooltip } from '@radix-ui/themes';
import ActivityCalendar from 'react-activity-calendar';
import { DAO } from '~/utils/dao';
import { useQuery } from '@tanstack/react-query';
import { map } from 'lodash-es';

function getLevel(count: number) {
  if (count < 1) return 0;
  if (count < 10) return 1;
  if (count < 20) return 2;
  return 3;
}

export function DailyActivity() {
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
        light: ['hsl(0, 0%, 92%)', 'rebeccapurple'],
        dark: ['hsl(0, 0%, 22%)', 'hsl(225,92%,77%)'],
      }}
      blockSize={12}
      renderBlock={(block, activity) => {
        return (
          <Tooltip content={`${activity.count} activities on ${activity.date}`}>
            {block}
          </Tooltip>
        );
      }}
    />
  );
}
