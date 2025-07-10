import { Button, Flex, Text } from '@radix-ui/themes';
import { map, range } from 'lodash-es';
import { Check } from 'lucide-react';
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
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          className="border-solid border-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            borderColor: colors[cat - 1],
            opacity: cat === localCategory ? 1 : 0.4,
          }}
          onClick={() => {
            setLocalCategory(cat);
          }}
        >
          {cat === localCategory && (
            <Check style={{ transform: 'scale(0.6)' }} />
          )}
        </div>
      ))}
    </Flex>
  );
}
