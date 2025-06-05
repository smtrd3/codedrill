/* eslint-disable react/display-name */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { runCompleteAnimation } from './confetti';
import { IconButton, Tooltip } from '@radix-ui/themes';
import { ActionDispatcher, TestItem, TestState } from '~/state';
import { find, findIndex, get, sample, size } from 'lodash-es';
import { DAO } from '~/utils/dao';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PowerModeInput from 'power-mode-input';
import { formatDate } from '~/utils/date';
import { snackbar } from '~/utils/snackbars';
import { useRouter } from '@tanstack/react-router';

let timerId = 0;

export type TypingPadProps = {
  tests: TestItem[];
  selectedId?: string | null;
  width?: number;
  height?: number;
  fontSize?: number;
  code: string;
  onStateChange: (state: TestState) => void;
  dispatch: ActionDispatcher;
};

export const TypingPad = memo((props: TypingPadProps) => {
  const {
    tests,
    selectedId,
    width = 900,
    height = 500,
    fontSize = 18,
    code,
    onStateChange,
    dispatch,
  } = props;
  const router = useRouter();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [typed, setTyped] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [testState, setTestState] = useState<TestState>('initial');
  const [continuousMode, setContinuousMode] = useState(false);
  const [randomMode, setRandomMode] = useState(false);

  const selectedTest = useMemo(() => {
    return find(tests, { uuid: selectedId }) as TestItem;
  }, [tests, selectedId]);

  const append = useCallback(
    (content: string) => {
      setTyped(typed => {
        let nextLine = typed + content;
        if (content === '  ') {
          const skipped = code.slice(nextLine.length);
          const matchedStartingWhitespace = skipped.match(/^[ ]+/);
          if (matchedStartingWhitespace) {
            nextLine += matchedStartingWhitespace[0];
          }
        }

        if (nextLine === code) {
          setTestState('complete');
        }

        return code.startsWith(nextLine) ? nextLine : typed;
      });
    },
    [code]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (testState === 'complete') {
        e.preventDefault();
        return;
      }

      // Start test on input
      setTestState('in-progress');

      if (e.code == 'Tab') {
        e.preventDefault();
        append('  ');
      } else if (e.code === 'Backspace') {
        e.preventDefault();
        setTyped(typed => typed.slice(0, -1));
      } else if (e.code === 'Enter') {
        append('\n');
      } else if (e.key.length === 1) {
        append(e.key);
      } else {
        e.preventDefault();
      }
    },
    [append, testState]
  );

  const onReset = useCallback(() => {
    setTyped('');
    setElapsed(0);
    setTestState('initial');

    if (timerId) {
      clearInterval(timerId);
    }
  }, []);

  const onRandomize = useCallback(() => {
    if (size(tests) > 1) {
      let nextId: null | string | undefined = selectedId;

      while (nextId === selectedId) {
        nextId = sample(tests)?.uuid;
      }

      if (nextId) {
        dispatch({ type: 'set_selected', payload: nextId });
      }
    }
  }, [tests, selectedId, dispatch]);

  const selectNext = useCallback(() => {
    if (size(tests) > 1) {
      const idx = findIndex(tests, item => item.uuid === selectedId);
      const nextIdx = (idx + 1) % size(tests);
      const nextId = tests[nextIdx].uuid;

      if (nextId) {
        dispatch({ type: 'set_selected', payload: nextId });
      }
    }
  }, [tests, selectedId, dispatch]);

  const startTest = useCallback(() => {
    return window.setInterval(() => {
      setElapsed(curr => curr + 500);
    }, 500);
  }, []);

  useEffect(() => {
    if (testState === 'in-progress') {
      timerId = startTest();
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [startTest, testState]);

  const updateActivity = useCallback(async () => {
    const date = formatDate();
    // const activityKey = `activity:${date}`;

    try {
      // const existing = (await DAO.get(activityKey)) as { count: number };
      // if (existing) {
      // DAO.update({ ...existing, count: sum([existing.count, 1]) });
      // } else {
      // DAO.put({ id: activityKey, count: 1 });
      // }
    } catch {
      snackbar.error('Failed up update activity');
    }
  }, []);

  useEffect(() => {
    if (testState === 'complete') {
      router.invalidate();
      onReset();

      if (selectedTest) {
        const prevElapsed = get(selectedTest, 'totalTime', 0);
        const prevCount = get(selectedTest, 'count', 0);

        DAO.updateTemplate({
          ...selectedTest,
          totalTime: elapsed + prevElapsed,
          count: prevCount + 1,
        });

        updateActivity();
      }

      if (continuousMode) {
        if (randomMode) {
          onRandomize();
        } else {
          selectNext();
        }
      } else {
        dispatch({ type: 'set_selected', payload: null });
        runCompleteAnimation();
      }
    }
  }, [
    testState,
    elapsed,
    selectedTest,
    onReset,
    continuousMode,
    randomMode,
    onRandomize,
    dispatch,
    selectNext,
    updateActivity,
    router,
  ]);

  useEffect(() => {
    onStateChange(testState);
  }, [testState, onStateChange]);

  useEffect(() => {
    onReset();
  }, [selectedId, code, onReset]);

  useEffect(() => {
    if (textarea.current) {
      PowerModeInput.make(textarea.current, {
        g: 0.6,
        num: 15,
        radius: 3,
        circle: true,
        alpha: [1, 0.1],
        color: 'random',
        life: 1.5,
      });
    }
  }, [selectedId]);

  const minutes = elapsed / 1000 / 60;
  const cmp = minutes === 0 ? '0.00' : (typed.length / minutes).toFixed(2);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-8 font-code font-size py-4">
          <div className="flex gap-2">
            <span className="font-bold text-lime-300">{cmp} CPM</span>
            <span>/</span>
            <span className="font-bold text-lime-300">
              {minutes.toFixed(2)} MIN
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <Tooltip
            content="Randomize"
            style={{ fontFamily: 'Cascadia Code' }}
            delayDuration={500}
          >
            <IconButton
              variant={randomMode ? 'solid' : 'soft'}
              onClick={() => setRandomMode(curr => !curr)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M10.998 1.58a2 2 0 0 1 2.004 0l7.5 4.342a2 2 0 0 1 .998 1.731v8.694a2 2 0 0 1-.998 1.73l-7.5 4.343a2 2 0 0 1-2.004 0l-7.5-4.342a2 2 0 0 1-.998-1.731V7.653a2 2 0 0 1 .998-1.73zM4.5 7.653v.005l6.502 3.764A2 2 0 0 1 12 13.153v7.536l7.5-4.342V7.653L12 3.311zM6.132 12.3c0-.552-.388-1.224-.866-1.5s-.866-.052-.866.5s.388 1.224.866 1.5s.866.052.866-.5m2.597 6.498c.478.276.866.053.866-.5c0-.552-.388-1.224-.866-1.5s-.866-.052-.866.5s.388 1.224.866 1.5M5.266 16.8c.478.276.866.052.866-.5s-.388-1.224-.866-1.5s-.866-.052-.866.5s.388 1.224.866 1.5m3.463-2c.478.277.866.053.865-.5c0-.552-.387-1.223-.866-1.5c-.478-.276-.866-.052-.866.5c0 .553.388 1.224.867 1.5M14.898 8c.478-.276.478-.724 0-1s-1.254-.276-1.732 0c-.479.276-.479.724 0 1c.478.276 1.254.276 1.732 0m-4.8-1c.478.276.478.724 0 1s-1.254.276-1.732 0s-.478-.724 0-1s1.254-.276 1.732 0m5.897 8.35c.598-.346 1.083-1.185 1.083-1.875s-.485-.97-1.082-.625s-1.083 1.184-1.083 1.875c0 .69.485.97 1.082.625"
                />
              </svg>
            </IconButton>
          </Tooltip>

          <Tooltip
            content="Back to back"
            style={{ fontFamily: 'Cascadia Code' }}
            delayDuration={500}
          >
            <IconButton
              variant={continuousMode ? 'solid' : 'soft'}
              onClick={() => setContinuousMode(curr => !curr)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <g fill="none" fillRule="evenodd">
                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="currentColor"
                    d="M5.669 4.76a1.47 1.47 0 0 1 2.04-1.177c1.062.454 3.442 1.533 6.462 3.276c3.021 1.744 5.146 3.267 6.069 3.958c.788.591.79 1.763.001 2.356c-.914.687-3.013 2.19-6.07 3.956c-3.06 1.766-5.412 2.832-6.464 3.28c-.906.387-1.92-.2-2.038-1.177c-.138-1.142-.396-3.735-.396-7.237c0-3.5.257-6.092.396-7.235"
                  />
                </g>
              </svg>
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div
        className="grid grid-cols-1 grid-rows-1 p-2 rounded bg-gray-900 bg-opacity-50"
        style={{ minWidth: width, minHeight: height }}
      >
        <textarea
          className="row-start-1 col-start-1 bg-transparent leading-normal overflow-hidden resize-none whitespace-pre outline-none font-code font-bold text-white caret-teal-300 select-none"
          onKeyDown={onKeyDown}
          value={typed}
          spellCheck={false}
          style={{ fontSize }}
          onChange={e => e.preventDefault()}
          ref={textarea}
        />
        <div
          className={
            'row-start-1 col-start-1 leading-normal overflow-hidden text-opacity-50 whitespace-pre pointer-events-none font-code text-white caret-lime-400'
          }
          style={{ fontSize }}
        >
          {code}
        </div>
      </div>
    </div>
  );
});
