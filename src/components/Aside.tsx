/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import cx from 'classnames';
import { map } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { IconButton } from '@radix-ui/themes';
import { Plus, Edit, Trash } from 'lucide-react';
import { ActionDispatcher, TestItem } from '~/state';
import { DAO } from '~/utils/dao';
import { useRouter } from '@tanstack/react-router';
import { Categories } from './Categories';

type AsideProps = {
  selectedId?: string | null;
  tests: TestItem[];
  testState: string;
  sidebarOpen: boolean;
  dispatch: ActionDispatcher;
  selectedCategory: number;
};

export function Aside(props: AsideProps) {
  const router = useRouter();
  const {
    selectedId,
    tests: items,
    testState,
    sidebarOpen,
    dispatch,
    selectedCategory,
  } = props;
  const allowEdit = useMemo(() => testState !== 'in-progress', [testState]);

  const stopPropagation = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
    },
    []
  );

  const createNew = useCallback(() => {
    dispatch({
      type: 'set_modal_state',
      payload: {
        open: true,
        mode: 'create',
        editItem: { category: selectedCategory },
      },
    });
  }, [dispatch, selectedCategory]);

  const editItem = useCallback(
    (item: TestItem) => {
      dispatch({
        type: 'set_modal_state',
        payload: { open: true, mode: 'edit', editItem: item },
      });
    },
    [dispatch]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this test?')) {
        dispatch({ type: 'delete_test', payload: id });
        await DAO.deleteTemplate(id);
        router.invalidate();
      }
    },
    [dispatch, router]
  );

  const onSelectionChange = useCallback(
    (id: string) => {
      dispatch({ type: 'set_sidebar_state', payload: false });
      dispatch({ type: 'set_selected', payload: id });
    },
    [dispatch]
  );

  const setCategory = useCallback(
    (id: number) => {
      dispatch({ type: 'set_category', payload: id });
    },
    [dispatch]
  );

  return (
    <div
      id="side-bar"
      className={cx(
        'fixed left-0 top-0 bottom-0 w-[360px] bg-slate-950 z-10 transition flex flex-col z-50',
        sidebarOpen
          ? 'opacity-100 pointer-events-auto translate-x-0'
          : 'opacity-0 pointer-events-none -translate-x-5'
      )}
      onClick={stopPropagation}
    >
      {/* Header with Create new */}
      <div className="flex justify-between items-center p-4 flex-shrink-0">
        <h2 className="text-lg font-bold text-slate-200 font-sans pl-8">
          Your Tests
        </h2>
        <IconButton
          variant="ghost"
          onClick={createNew}
          style={{ cursor: 'pointer' }}
        >
          <Plus size={18} className="cursor-pointer" />
        </IconButton>
      </div>
      <div className="pl-4 mb-4">
        <Categories category={selectedCategory} setCategory={setCategory} />
      </div>
      <div className="flex-grow overflow-x-hidden overflow-y-auto">
        {map(items, item => (
          <div
            key={item.uuid}
            onClick={() => onSelectionChange(item.uuid)}
            className={cx(
              'group text-white pr-4 cursor-pointer flex justify-between items-center',
              selectedId === item.uuid ? 'font-bold' : ''
            )}
          >
            <span
              className={cx(
                'whitespace-pre text-ellipsis overflow-hidden py-2 pl-4',
                'flex-grow font-sans',
                selectedId === item.uuid
                  ? 'text-white'
                  : 'text-white text-opacity-60 group-hover:text-opacity-100'
              )}
            >
              {item.title}
            </span>
            <div
              className={cx(
                'flex items-center gap-4 transition-opacity',
                selectedId === item.uuid
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100'
              )}
            >
              <IconButton
                variant="ghost"
                onClick={e => {
                  e.stopPropagation();
                  editItem(item);
                }}
                disabled={!allowEdit}
                style={{ cursor: 'pointer' }}
              >
                <Edit size={16} color="white" />
              </IconButton>
              <IconButton
                variant="ghost"
                color="red"
                onClick={e => {
                  e.stopPropagation();
                  deleteItem(item.uuid);
                }}
                disabled={!allowEdit}
                style={{ cursor: 'pointer' }}
              >
                <Trash size={16} color="white" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
