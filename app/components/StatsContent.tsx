import { DataList, Flex, Table } from "@radix-ui/themes";
import { divide, map, size, sumBy } from "lodash-es";
import { useCallback, useEffect, useState } from "react";
import { listen } from "./events";
import { DAO } from "~/utils/dao";

type StatsContentProps = {
  updateKey?: string;
};

export function StatsContent(props: StatsContentProps) {
  const { updateKey = "-" } = props;
  const [items, setItems] = useState<
    {
      id: string;
      title: string;
      code: string;
      testCount: number;
      elapsed: number;
    }[]
  >([]);

  const sync = useCallback(async () => {
    const items = await DAO.getAll();
    setItems(items);
  }, []);

  useEffect(() => {
    sync();
  }, [updateKey, sync]);

  useEffect(() => {
    return listen("deleted", () => {
      sync();
    });
  }, []);

  useEffect(() => {
    return listen("added", () => {
      sync();
    });
  }, []);

  return (
    <Flex direction="column" gap="3">
      <DataList.Root>
        <DataList.Item align="center">
          <DataList.Label minWidth="88px">Total Tests</DataList.Label>
          <DataList.Value>
            <span>{sumBy(items, "testCount")}</span>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item align="center">
          <DataList.Label minWidth="88px">Total time spent</DataList.Label>
          <DataList.Value>
            <span>
              {divide(divide(sumBy(items, "elapsed"), 1000), 60).toFixed(2)}{" "}
              Minutes
            </span>
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>

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
            {map(items, (item) => (
              <Table.Row key={item.id}>
                <Table.RowHeaderCell className="max-w-[200px] text-ellipsis overflow-hidden">
                  {item.title}
                </Table.RowHeaderCell>
                <Table.Cell>{item.testCount}</Table.Cell>
                <Table.Cell>
                  {divide(divide(item.elapsed, 1000), 60).toFixed(2)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Flex>
  );
}
