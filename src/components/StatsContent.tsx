import { Button, Flex, Heading, Table } from '@radix-ui/themes';
import { TestItem } from '~/state';
import {
  clamp,
  divide,
  get,
  isEmpty,
  map,
  size,
  sortBy,
  sumBy,
} from 'lodash-es';
import { memo, useCallback, useMemo } from 'react';
import { ListChecks, Timer, Zap, Play, Plus, LogOut } from 'lucide-react';
import { authClient } from '~/lib/client/auth-client';
import { Link, useNavigate } from '@tanstack/react-router';
import { DailyActivity } from './DailyActivity';
import { If, Then } from 'react-if';

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
      <div className="relative bg-slate-900/50 border border-slate-700/50 p-6 rounded-2xl flex items-center gap-6 h-full shadow-lg">
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

export const StatsContent = memo(function StatsContentImpl(
  props: StatsContentProps
) {
  const { items, onStartTest, onCreateTest } = props;
  const sortedItems = sortBy(items, 'count').reverse();
  const navigate = useNavigate();
  const noTests = useMemo(() => isEmpty(items), [items]);

  const signOut = useCallback(async () => {
    await authClient.signOut();
    navigate({ to: '/' });
  }, [navigate]);

  const secondsToMinutes = (seconds: number) => {
    return divide(seconds, 60).toFixed(2);
  };

  const bestWpm = useMemo(() => {
    const wpm = Math.max(...map(items, entry => get(entry, 'bestWpm', 0)));
    return clamp(wpm, 0, 1000);
  }, [items]);

  return (
    <Flex direction="column" gap={'6'} className="w-full">
      <div className="flex justify-between p-4 items-center font-bold">
        <Link className="block p-0 text-lg" to="/">
          &lt; CodeDrill /&gt;
        </Link>
        <Button variant="ghost" onClick={signOut} style={{ cursor: 'pointer' }}>
          <LogOut className="cursor-pointer" size={16} />
          <span className="font-sans font-bold">Sign Out</span>
        </Button>
      </div>
      <div
        className={`grid grid-cols-1 ${!noTests ? 'md:grid-cols-2' : ''} gap-6`}
      >
        {!noTests && (
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
        )}
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
            value={secondsToMinutes(sumBy(items, 'totalTime'))}
            unit="min"
          />
          <StatCard
            icon={<Zap size={28} className="text-amber-400" />}
            title="Top Speed"
            value={bestWpm}
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
          <DailyActivity />
        </div>
      </Flex>

      <Flex direction="column" gap="4">
        <If condition={!noTests}>
          <Then>
            <Heading
              as="h2"
              size="6"
              className="font-sans font-bold text-slate-200"
            >
              Breakdown
            </Heading>
          </Then>
        </If>
        <If condition={!noTests}>
          <Then>
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
                          {secondsToMinutes(item.totalTime)}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              )}
            </div>
          </Then>
        </If>
      </Flex>
    </Flex>
  );
});
