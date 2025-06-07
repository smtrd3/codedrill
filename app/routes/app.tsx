/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { Aside } from '~/components/Aside';
import { IconBack, IconSidebar } from '~/components/icons';
import { EditPopup } from '~/components/Popup';
import { initialState, reducer, TestState } from '~/state';
import { DAO } from '~/utils/dao';
import { find, findIndex, get, isEmpty, sample, size } from 'lodash-es';
import { Badge, BadgeProps, Button, Flex } from '@radix-ui/themes';
import { StatsContent } from '~/components/StatsContent';
import { TestStats, TypingTest } from '~/components/TypingTest/TypingTest';
import { runCompleteAnimation } from '~/components/confetti';
import cx from 'classnames';

export const Route = createFileRoute('/app')({
  component: AppLayout,
  loader: async () => {
    return await DAO.getUserTemplates();
  },
  ssr: false,
});

const TEST_STATE_CONFIG: Record<TestState, { color: string; label: string }> = {
  'in-progress': { color: 'green' as const, label: 'RUNNING' },
  complete: { color: 'purple' as const, label: 'COMPLETE' },
  failed: { color: 'red' as const, label: 'FAILED' },
  reset: { color: 'blue' as const, label: 'READY' },
  initial: { color: 'gray' as const, label: 'READY' },
};

function AppLayout() {
  const tests = Route.useLoaderData();
  const [state, dispatch] = useReducer(reducer, initialState, state => ({
    ...state,
    tests: tests,
  }));

  const testsFromState = useMemo(() => state.tests, [state.tests]);
  const snippet = useMemo(
    () => find(testsFromState, { uuid: state.selectedId }),
    [testsFromState, state]
  );
  const selectedId = useMemo(() => state.selectedId, [state.selectedId]);
  const typingState = useMemo(() => state.testState, [state.testState]);
  const sidebarOpen = useMemo(() => state.sidebarOpen, [state.sidebarOpen]);

  const toggleSidebar = useCallback(
    (e: React.MouseEvent<any>) => {
      e.stopPropagation();
      dispatch({
        type: 'set_sidebar_state',
        payload: state.sidebarOpen ? false : true,
      });
    },
    [state.sidebarOpen]
  );

  const setTypingState = useCallback((testState: TestState) => {
    dispatch({ type: 'set_test_state', payload: testState });
  }, []);

  const setSelectedId = useCallback((selectedId: string | null) => {
    dispatch({ type: 'set_selected', payload: selectedId });
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

  const asideProps = useMemo(() => {
    return {
      tests: state.tests,
      sidebarOpen: state.sidebarOpen,
      testState: state.testState,
      selectedId: state.selectedId,
    };
  }, [state.tests, state.sidebarOpen, state.testState, state.selectedId]);

  const modalState = useMemo(() => state.modalState, [state.modalState]);

  useEffect(() => {
    if (!snippet) {
      dispatch({ type: 'set_test_state', payload: 'initial' });
    }
  }, [snippet]);

  useEffect(() => {
    dispatch({ type: 'replace', payload: tests });
  }, [tests]);

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

  const handleTestComplete = useCallback(
    (stats: TestStats) => {
      setTypingState('complete');

      if (stats.typingOptions.has('back-to-back')) {
        if (stats.typingOptions.has('randomization')) {
          onRandomize();
        } else {
          selectNext();
        }
      } else {
        runCompleteAnimation();
        setSelectedId(null);
      }
    },
    [onRandomize, setSelectedId, setTypingState, selectNext]
  );

  return (
    <>
      <div
        className="w-full flex items-center flex-col text-white font-code min-h-screen"
        onClick={e => {
          e.stopPropagation();
          dispatch({ type: 'set_sidebar_state', payload: false });
        }}
      >
        {isEmpty(testsFromState) && (
          <Flex pt={'8'}>
            <Button>Create your first test</Button>
          </Flex>
        )}
        {snippet && (
          <h1 className="flex items-center mt-4 w-[800px] text-2xl gap-4">
            <button className="text-white" onClick={() => setSelectedId(null)}>
              {IconBack}
            </button>
            <span className="font-sans">{snippet?.title}</span>
            {(() => {
              const state = get(TEST_STATE_CONFIG, typingState, {
                color: 'gray',
                label: 'READY',
              });

              return (
                <Badge color={state.color as BadgeProps['color']}>
                  <span className="font-bold">{state.label}</span>
                </Badge>
              );
            })()}
          </h1>
        )}
        {snippet && (
          <div className="mt-8 min-w-[900px] w-[80%]">
            <TypingTest
              text={snippet!.template}
              onComplete={handleTestComplete}
              onTestStart={() => setTypingState('in-progress')}
              onStateChange={setTypingState}
              width="100%"
              height="auto"
            />
          </div>
        )}
        {isEmpty(snippet) && (
          <div className="w-[900px] pt-20">
            <StatsContent items={testsFromState} />
          </div>
        )}
      </div>
      {/* Toggle sidebar action */}
      <button
        className={cx(
          'text-white fixed left-2 top-3 bg-gray-950 p-2 rounded z-50',
          'transition-opacity duration-200',
          'hover:opacity-100',
          sidebarOpen ? 'opacity-100' : 'opacity-50'
        )}
        onClick={toggleSidebar}
      >
        {IconSidebar}
      </button>
      <Aside {...asideProps} dispatch={dispatch} />
      <EditPopup {...modalState} dispatch={dispatch} />
    </>
  );
}
