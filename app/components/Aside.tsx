/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import cx from "classnames";
import { map } from "lodash-es";
import { useCallback, useMemo } from "react";
import { IconAdd, IconEdit } from "./icons";
import { ActionDispatcher, TestItem } from "~/state";

type AsideProps = {
  selectedId?: string | null;
  tests: TestItem[];
  testState: string;
  sidebarOpen: boolean;
  dispatch: ActionDispatcher;
};

export function Aside(props: AsideProps) {
  const { selectedId, tests: items, testState, sidebarOpen, dispatch } = props;
  const allowEdit = useMemo(() => testState !== "in-progress", [testState]);

  const stopPropagation = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
    },
    [],
  );

  const createNew = useCallback(() => {
    dispatch({
      type: "set_modal_state",
      payload: { open: true, mode: "create", editItem: undefined },
    });
  }, [dispatch]);

  const editItem = useCallback(
    (item: TestItem) => {
      dispatch({
        type: "set_modal_state",
        payload: { open: true, mode: "edit", editItem: item },
      });
    },
    [dispatch],
  );

  const onSelectionChange = useCallback(
    (e: React.MouseEvent, id: string) => {
      dispatch({ type: "set_sidebar_state", payload: false });
      dispatch({ type: "set_selected", payload: id });
    },
    [dispatch],
  );

  return (
    <div
      id="side-bar"
      className={cx(
        "fixed left-0 top-0 bottom-0 w-[320px] bg-gray-950 z-10 transition",
        sidebarOpen
          ? "opacity-100 pointer-events-auto translate-x-0"
          : "opacity-0 pointer-events-none -translate-x-5",
      )}
      onClick={stopPropagation}
    >
      {/* Create new */}
      <div className="flex justify-end p-1">
        <button className="text-white p-2 rounded" onClick={createNew}>
          {IconAdd}
        </button>
      </div>
      <div className="absolute top-12 left-0 right-0 bottom-0 overflow-x-hidden overflow-y-auto">
        {map(items, (item) => (
          <div
            key={item.id}
            className="text-white p-2 cursor-pointer flex justify-between items-center"
          >
            <span
              onClick={(e) => onSelectionChange(e, item.id)}
              className={cx(
                "whitespace-pre text-ellipsis overflow-hidden px-2",
                "flex-grow font-code font-bold",
                selectedId === item.id
                  ? "text-fuchsia-500"
                  : "text-white text-opacity-75 hover:text-opacity-100",
              )}
            >
              {item.title}
            </span>
            <button
              className={cx(
                "text-white pr-1",
                allowEdit ? "" : "text-opacity-15",
              )}
              onClick={() => editItem(item)}
              disabled={!allowEdit}
            >
              {IconEdit}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
