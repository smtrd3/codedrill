import { map, reject, set } from 'lodash-es';

export type TestState =
  | 'initial'
  | 'in-progress'
  | 'complete'
  | 'failed'
  | 'reset';

export type TestItem = {
  id: number;
  uuid: string;
  title: string;
  template: string;
  count: number;
  totalTime: number;
  category: number;
};

export type State = {
  typed: string;
  elapsed: number;
  testState: TestState;
  revealed: boolean;
  sidebarOpen: boolean;
  selectedId?: string;
  tests: TestItem[];
  timerId?: number;
  allowEdit?: boolean;
  modalOpen: boolean;
  selectedCategory: number;
  modalState: {
    open: boolean;
    mode: 'edit' | 'create';
    editItem?: TestItem;
  };
};

export type ActionDispatcher = React.ActionDispatch<
  [{ type: string; payload?: any }]
>;

export const initialState: State = {
  typed: '',
  elapsed: 0,
  testState: 'initial',
  revealed: false,
  sidebarOpen: false,
  selectedId: undefined,
  tests: [],
  timerId: undefined,
  allowEdit: true,
  modalOpen: false,
  selectedCategory: 1,
  modalState: {
    open: false,
    mode: 'create',
    editItem: undefined,
  },
};

export function reducer(
  state: State = initialState,
  action: { type: string; payload?: any }
): State {
  const { type, payload } = action;
  const newState = { ...state };

  switch (type) {
    case 'set_category':
      set(newState, 'selectedId', undefined);
      return set(newState, 'selectedCategory', payload);
    case 'replace':
      return set(newState, 'tests', payload);
    case 'set_selected':
      return set(newState, 'selectedId', payload);
    case 'set_sidebar_state':
      return set(newState, 'sidebarOpen', payload);
    case 'set_modal_state':
      return set(newState, 'modalState', {
        ...newState.modalState,
        ...payload,
      });
    case 'set_test_state':
      return set(newState, 'testState', payload);
    case 'add_test':
      return set(newState, 'tests', [payload, ...newState.tests]);
    case 'delete_test': {
      if (payload === state.selectedId) {
        set(newState, 'selectedId', null);
      }
      return set(newState, 'tests', reject(newState.tests, { id: payload }));
    }
    case 'update_test': {
      const tests = map(newState.tests, item => {
        if (item.id === payload.id) {
          return {
            ...item,
            ...payload,
          };
        }
        return item;
      });

      return set(newState, 'tests', tests);
    }
    case 'set_elapsed':
      return set(newState, 'elapsed', action.payload);
  }

  return newState;
}
