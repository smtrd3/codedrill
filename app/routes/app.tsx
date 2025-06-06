/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { Aside } from '~/components/Aside';
import { IconBack, IconSidebar } from '~/components/icons';
import { EditPopup } from '~/components/Popup';
import { initialState, reducer, TestItem, TestState } from '~/state';
import { DAO } from '~/utils/dao';
import { find, findIndex, isEmpty, sample, size } from 'lodash-es';
import { Badge, Button, Flex } from '@radix-ui/themes';
import { StatsContent } from '~/components/StatsContent';
import { TestStats, TypingTest } from '~/components/TypingTest/TypingTest';
import { runCompleteAnimation } from '~/components/confetti';

export const Route = createFileRoute('/app')({
  component: AppLayout,
  loader: async () => {
    return await DAO.getUserTemplates();
  },
  ssr: false,
});

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
            <span>{snippet?.title}</span>
            {typingState === 'in-progress' && (
              <Badge color="green" className="font-bold">
                RUNNING
              </Badge>
            )}
            {typingState === 'complete' && (
              <Badge color="purple" className="font-bold">
                COMPLETE
              </Badge>
            )}
          </h1>
        )}
        {snippet && (
          <div className="mt-8 min-w-[900px] w-[80%]">
            <TypingTest
              text={snippet!.template}
              onComplete={handleTestComplete}
              width="100%"
              height="auto"
            />
            {/* <TypingPad
              tests={testsFromState}
              selectedId={selectedId}
              code={snippet!.template}
              onStateChange={setTypingState}
              dispatch={dispatch}
            /> */}
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
        className="text-white fixed left-1 top-1 bg-gray-950 p-2 rounded z-50"
        onClick={toggleSidebar}
      >
        {IconSidebar}
      </button>
      {/* <Stats /> */}
      <Aside {...asideProps} dispatch={dispatch} />
      <EditPopup {...modalState} dispatch={dispatch} />
    </>
  );
}
