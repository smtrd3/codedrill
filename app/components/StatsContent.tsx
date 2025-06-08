import { Button, Flex, Heading, Table, Tooltip } from '@radix-ui/themes';
import { TestItem } from '~/state';
import { format } from 'date-fns';
import { divide, map, size, sortBy, sumBy } from 'lodash-es';
import ActivityCalendar, { Activity } from 'react-activity-calendar';
import { useCallback, useMemo } from 'react';
import { ListChecks, Timer, Zap, Play, Plus, LogOut } from 'lucide-react';
import { authClient } from '~/lib/client/auth-client';
import { useNavigate } from '@tanstack/react-router';

type StatsContentProps = {
  items: TestItem[];
  onStartTest: () => void;
  onCreateTest: () => void;
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit: string;
}

function StatCard({ icon, title, value, unit }: StatCardProps) {
  return (
    <div className="[transform-style:preserve-3d] transition-transform duration-500 hover:scale-105 hover:rotate-x-12 hover:rotate-y-[-8deg]">
      <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl flex items-center gap-6 h-full shadow-lg">
        <div className="bg-slate-950/70 p-4 rounded-full border border-slate-700">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 font-sans text-base">{title}</span>
          <span className="text-slate-100 font-sans text-4xl font-bold">
            {value}
            <span className="text-2xl text-slate-300 ml-2">{unit}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function generateRandomData(count: number): Activity[] {
  const today = new Date();
  const data: Activity[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(
      today.getFullYear(),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      count: Math.floor(Math.random() * 5),
      level: Math.floor(Math.random() * 4) as Activity['level'],
    });
  }
  return data;
}

export function StatsContent(props: StatsContentProps) {
  const { items, onStartTest, onCreateTest } = props;
  const sortedItems = sortBy(items, 'count').reverse();
  const navigate = useNavigate();
  const activityData = useMemo(() => generateRandomData(200), []);

  const signOut = useCallback(async () => {
    await authClient.signOut();
    navigate({ to: '/auth' });
  }, [navigate]);

  return (
    <Flex direction="column" gap={'6'} className="w-full">
      <div className="flex justify-end p-4">
        <Button variant="soft" onClick={signOut}>
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          type="button"
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-slate-800 p-10 font-bold text-white transition-transform duration-300 hover:scale-105"
          onClick={onStartTest}
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-20 flex flex-col items-center">
            <Play size={48} className="mb-4" />
            <span className="text-3xl font-sans">Start Test</span>
          </div>
        </button>
        <button
          type="button"
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-slate-800 p-10 font-bold text-white transition-transform duration-300 hover:scale-105"
          onClick={onCreateTest}
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-20 flex flex-col items-center">
            <Plus size={48} className="mb-4" />
            <span className="text-3xl font-sans">Create Test</span>
          </div>
        </button>
      </div>

      <Flex direction="column" gap="4">
        <Heading
          as="h2"
          size="6"
          className="font-sans font-bold text-slate-200"
        >
          Overview
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 [perspective:2000px]">
          <StatCard
            icon={<ListChecks size={28} className="text-cyan-400" />}
            title="Total Tests Taken"
            value={sumBy(items, 'count')}
            unit="tests"
          />
          <StatCard
            icon={<Timer size={28} className="text-fuchsia-400" />}
            title="Time Spent"
            value={divide(divide(sumBy(items, 'totalTime'), 1000), 60).toFixed(
              1
            )}
            unit="min"
          />
          <StatCard
            icon={<Zap size={28} className="text-amber-400" />}
            title="Top Speed"
            value="120"
            unit="WPM"
          />
        </div>
      </Flex>

      <Flex direction={'column'} gap="4">
        <Heading
          as="h2"
          size="6"
          className="font-sans font-bold text-slate-200"
        >
          Daily Activity
        </Heading>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <ActivityCalendar
            data={activityData}
            theme={{
              light: ['hsl(0, 0%, 92%)', 'rebeccapurple'],
              dark: ['hsl(0, 0%, 22%)', 'hsl(225,92%,77%)'],
            }}
            blockSize={16}
            renderBlock={(block, activity) => {
              return (
                <Tooltip
                  content={`${activity.count} activities on ${activity.date}`}
                >
                  {block}
                </Tooltip>
              );
            }}
          />
        </div>
      </Flex>

      <Flex direction="column" gap="4">
        <Heading
          as="h2"
          size="6"
          className="font-sans font-bold text-slate-200"
        >
          Breakdown
        </Heading>
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
          {size(items) > 0 && (
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Test name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Count</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {map(sortedItems, item => (
                  <Table.Row key={item.uuid}>
                    <Table.RowHeaderCell className="max-w-[200px] text-ellipsis overflow-hidden">
                      {item.title}
                    </Table.RowHeaderCell>
                    <Table.Cell>{item.count}</Table.Cell>
                    <Table.Cell>
                      {divide(divide(item.totalTime, 1000), 60).toFixed(2)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </div>
      </Flex>
    </Flex>
  );
}
