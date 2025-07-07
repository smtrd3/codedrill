/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { Aside } from '~/components/Aside';
import { IconSidebar } from '~/components/icons';
import { EditPopup } from '~/components/Popup';
import { initialState, reducer, TestState } from '~/state';
import { DAO } from '~/utils/dao';
import { filter, find, findIndex, get, sample, size } from 'lodash-es';
import { StatsContent } from '~/components/StatsContent';
import {
  TestStats,
  TypingOption,
  TypingTest,
} from '~/components/TypingTest/TypingTest';
import cx from 'classnames';
import { handleAuthRedirect } from '~/utils/server';
import { X } from 'lucide-react';
import { queryClient } from '~/lib/client/queryClient';

export const Route = createFileRoute('/app')({
  component: AppLayout,
  loader: async () => {
    return await DAO.getUserTemplates();
  },
  beforeLoad: async () => {
    await handleAuthRedirect();
  },
  ssr: false,
});

function AppLayout() {
  const router = useRouter();
  const tests = Route.useLoaderData();
  const [state, dispatch] = useReducer(reducer, initialState, state => ({
    ...state,
    tests: tests,
  }));
  const [resetId, setResetId] = useState(0);
  const selectedId = useMemo(() => state.selectedId, [state.selectedId]);
  const typingState = useMemo(() => state.testState, [state.testState]);
  const sidebarOpen = useMemo(() => state.sidebarOpen, [state.sidebarOpen]);
  const selectedCategory = useMemo(
    () => state.selectedCategory,
    [state.selectedCategory]
  );
  const testsFromState = useMemo(
    () => filter([...state.tests], { category: selectedCategory }),
    [selectedCategory, state.tests]
  );
  const snippet = useMemo(
    () => find(testsFromState, { uuid: selectedId }),
    [testsFromState, selectedId]
  );
  const [enabledOptions, setEnabledOptions] = useState<Set<TypingOption>>(
    () => {
      const initialOptions = new Set<TypingOption>();
      initialOptions.add('power-mode');
      initialOptions.add('repeat');
      return initialOptions;
    }
  );

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
    if (size(testsFromState) > 1) {
      let nextId: null | string | undefined = selectedId;

      while (nextId === selectedId) {
        nextId = sample(testsFromState)?.uuid;
      }

      if (nextId) {
        dispatch({ type: 'set_selected', payload: nextId });
      }
    } else if (size(testsFromState) === 1) {
      setSelectedId(testsFromState[0].uuid);
    }
  }, [testsFromState, selectedId, dispatch, setSelectedId]);

  const asideProps = useMemo(() => {
    return {
      tests: testsFromState,
      sidebarOpen: state.sidebarOpen,
      testState: state.testState,
      selectedId: state.selectedId,
      selectedCategory,
    };
  }, [
    testsFromState,
    state.sidebarOpen,
    state.testState,
    state.selectedId,
    selectedCategory,
  ]);

  const modalState = useMemo(() => state.modalState, [state.modalState]);

  // useEffect(() => {
  //   if (!snippet) {
  //     dispatch({ type: 'set_test_state', payload: 'initial' });
  //   }
  // }, [snippet]);

  // useEffect(() => {
  //   dispatch({ type: 'replace', payload: testsFromState });
  // }, [testsFromState]);

  const selectNext = useCallback(
    (isPrevious: boolean = false) => {
      if (size(testsFromState) > 1) {
        const idx = findIndex(testsFromState, item => item.uuid === selectedId);
        const nextIdx = isPrevious
          ? (idx - 1 + size(testsFromState)) % size(testsFromState)
          : (idx + 1) % size(testsFromState);
        const nextId = testsFromState[nextIdx].uuid;

        if (nextId) {
          dispatch({ type: 'set_selected', payload: nextId });
        }
      } else {
        setResetId(prev => prev + 1);
      }
    },
    [testsFromState, selectedId, dispatch]
  );

  const handleTestComplete = useCallback(
    async (stats: TestStats) => {
      const testId = snippet?.uuid;

      setTypingState('complete');

      if (stats.typingOptions.has('repeat')) {
        setResetId(prev => prev + 1);
      } else if (stats.typingOptions.has('randomization')) {
        onRandomize();
      } else {
        selectNext();
      }

      await DAO.updateStats({
        uuid: testId!,
        time: stats.time,
        mistakes: stats.mistakes,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
      });

      queryClient.invalidateQueries({ queryKey: ['daily-activity'] });
      router.invalidate();
      setResetId(prev => prev + 1);
    },
    [onRandomize, setTypingState, selectNext, snippet, router]
  );

  return (
    <>
      <div
        className="w-full flex items-center flex-col bg-black text-white font-code min-h-screen"
        onClick={e => {
          e.stopPropagation();
          dispatch({ type: 'set_sidebar_state', payload: false });
        }}
      >
        <div className="w-[900px] pt-20">
          <StatsContent
            items={testsFromState}
            onStartTest={onRandomize}
            onCreateTest={() => {
              dispatch({
                type: 'set_modal_state',
                payload: {
                  open: true,
                  mode: 'create',
                  editItem: { category: selectedCategory },
                },
              });
            }}
          />
        </div>
        {snippet && (
          <div className="fixed top-0 left-0 w-full h-full backdrop-blur-[100px] bg-black/40 z-50 flex flex-col items-center">
            <div className="flex min-w-[900px] w-10/12 py-4">
              <h1 className="flex align-center text-2xl gap-4">
                <span className="font-sans">{snippet?.title}</span>
              </h1>
            </div>
            <div className="flex min-w-[900px] w-10/12 py-4">
              <TypingTest
                key={resetId}
                text={snippet!.template}
                onComplete={handleTestComplete}
                onTestStart={() => setTypingState('in-progress')}
                onStateChange={setTypingState}
                width="100%"
                height="auto"
                typingState={typingState}
                onPrevious={() => selectNext(true)}
                onNext={() => selectNext(false)}
                enabledOptions={enabledOptions}
                setEnabledOptions={setEnabledOptions}
              />
            </div>
          </div>
        )}
      </div>
      {/* Toggle sidebar action */}
      <button
        className={cx(
          'text-white fixed left-2 top-3 bg-gray-950 p-2 rounded',
          'transition-opacity duration-200',
          'hover:opacity-100',
          sidebarOpen ? 'opacity-100' : 'opacity-50'
        )}
        onClick={toggleSidebar}
        style={{ zIndex: 9999999 }}
      >
        {IconSidebar}
      </button>
      {snippet && (
        <button
          className={cx(
            'fixed top-4 right-4 z-50 text-white p-2 rounded-full bg-gray-950 transition-opacity duration-200 hover:opacity-100 opacity-50',
            'bg-white/10'
          )}
          onClick={() => {
            setSelectedId(null);
            router.invalidate();
          }}
        >
          <X size={16} />
        </button>
      )}
      <Aside {...asideProps} dispatch={dispatch} />
      <EditPopup {...modalState} dispatch={dispatch} />
    </>
  );
}
