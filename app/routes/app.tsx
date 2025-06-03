import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { Aside } from '~/components/Aside';
import { IconBack, IconSidebar } from '~/components/icons';
import { EditPopup } from '~/components/Popup';
import { initialState, reducer, TestItem, TestState } from '~/state';
import { DAO } from '~/utils/dao';
import { Toaster } from 'react-hot-toast';
import { find, get, isEmpty } from 'lodash-es';
import { listen } from '~/components/events';
import { Badge, Button, Flex } from '@radix-ui/themes';
import { TypingPad } from '~/components/TypingPad';
import { StatsContent } from '~/components/StatsContent';

export const Route = createFileRoute('/app')({
    component: AppLayout,
    loader: async () => {
        return DAO.getAll() as unknown as TestItem[]
    },
    ssr: false,
})

function AppLayout() {
    const tests = Route.useLoaderData();
    const [state, dispatch] = useReducer(reducer, initialState, (state) => ({ ...state, tests: tests }));

    const testsFromState = useMemo(() => state.tests, [state.tests]);
    const snippet = useMemo(() => find(testsFromState, { id: state.selectedId }), [testsFromState, state]);
    const selectedId = useMemo(() => state.selectedId, [state.selectedId]);
    const typingState = useMemo(() => state.testState, [state.testState]);

    const toggleSidebar = useCallback((e: React.MouseEvent<any>) => {
        e.stopPropagation();
        dispatch({ type: "set_sidebar_state", payload: state.sidebarOpen ? false : true });
    }, [state.sidebarOpen]);

    const setTypingState = useCallback((testState: TestState) => {
        dispatch({ type: "set_test_state", payload: testState });
    }, []);

    const setSelectedId = useCallback((selectedId: string | null) => {
        dispatch({ type: "set_selected", payload: selectedId });
    }, []);

    const asideProps = useMemo(() => {
        return {
            tests: state.tests,
            sidebarOpen: state.sidebarOpen,
            testState: state.testState,
            selectedId: state.selectedId,
        }
    }, [state.tests, state.sidebarOpen, state.testState, state.selectedId]);

    const modalState = useMemo(() => state.modalState, [state.modalState]);

    useEffect(() => {
        function close() {
            // setSidebarOpen((open) => (open ? false : open));
        }

        // document.addEventListener("click", close);

        return () => {
            // document.removeEventListener("click", close);
        };
    }, []);

    useEffect(() => {
        if (!snippet) {
            dispatch({ type: "set_test_state", payload: 'initial' });
        }
    }, [snippet]);

    return <>
        <div className="w-full flex items-center flex-col text-white font-code">
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
                        <Badge color="green" className="font-bold">RUNNING</Badge>
                    )}
                    {typingState === 'complete' && (
                        <Badge color="purple" className="font-bold">COMPLETE</Badge>
                    )}
                </h1>
            )}
            {snippet && (
                <div className="mt-8">
                    <TypingPad
                        tests={testsFromState}
                        selectedId={selectedId}
                        code={snippet!.code}
                        onStateChange={setTypingState}
                        dispatch={dispatch}
                    />
                </div>
            )}
            {isEmpty(snippet) && (
                <div className='w-[900px] pt-20'>
                    <StatsContent />
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
}
