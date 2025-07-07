import { Button, Flex, Text } from '@radix-ui/themes';
import { map, range } from 'lodash-es';
import { useEffect, useState, useTransition } from 'react';
import { colors } from '~/app.constants';

export type CategoriesProps = {
  category: number;
  setCategory: (category: number) => void;
};

export function Categories(props: CategoriesProps) {
  const { category, setCategory } = props;
  const [localCategory, setLocalCategory] = useState(category);
  const [, startCategoryTransition] = useTransition();

  useEffect(() => {
    startCategoryTransition(() => {
      setCategory(localCategory);
    });
  }, [setCategory, localCategory]);

  return (
    <Flex gap="2">
      {map(range(1, colors.length + 1), cat => (
        <Button
          key={cat}
          variant={cat === localCategory ? 'solid' : 'soft'}
          color={colors[cat - 1][0] as any}
          radius="full"
          style={{
            width: '28px',
            height: '28px',
            boxShadow:
              cat === localCategory
                ? '0 0 0 2px rgba(255, 255, 255, 0.8)'
                : 'none',
          }}
          onClick={() => {
            setLocalCategory(cat);
          }}
        >
          <Text as="div" size="2" weight="bold">
            {colors[cat - 1][1]}
          </Text>
        </Button>
      ))}
    </Flex>
  );
}
