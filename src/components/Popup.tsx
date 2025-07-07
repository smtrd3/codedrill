/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Button,
  Dialog,
  Flex,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { DAO } from '~/utils/dao';
import { ActionDispatcher, State } from '~/state';
import { If, Then } from 'react-if';
import { snackbar } from '~/utils/snackbars';
import {
  enableTabToIndent,
  indentSelection,
  unindentSelection,
} from 'indent-textarea';
import { useRouter } from '@tanstack/react-router';
import { Categories } from './Categories';

type PopupProps = State['modalState'] & {
  dispatch: ActionDispatcher;
};

function EditPopupImpl(props: PopupProps) {
  const { open, editItem, mode, dispatch } = props;
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [category, setCategory] = useState(editItem?.category || 1);

  const editItemId = useMemo(() => editItem?.uuid, [editItem?.uuid]);

  const onTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    []
  );

  const onCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCode(e.target.value);
    },
    []
  );

  const validate = useCallback(() => {
    if (title.length < 10) {
      snackbar.error('Title should be at least 10 characters long');
      return false;
    }

    if (code.length < 28) {
      snackbar.error('Code snippet is too short');
      return false;
    }

    return true;
  }, [title, code]);

  const onSave = useCallback(async () => {
    if (validate()) {
      const cleanCode = (code || '')
        .replace(/\n+/, '\n')
        .replaceAll('\t', '    ')
        .split('\n')
        .map(line => line.trimEnd())
        .filter(line => line !== '')
        .join('\n');

      if (editItemId) {
        const curr = await DAO.getTemplate(editItemId);
        const updated = { ...curr, title, template: cleanCode, category };

        try {
          await DAO.updateTemplate(
            updated as {
              uuid: string;
              title: string;
              template: string;
              category: number;
            }
          );
          dispatch({ type: 'update_test', payload: updated });
          dispatch({ type: 'set_modal_state', payload: { open: false } });
        } catch {
          snackbar.error('Failed to update test, please try after some time');
        }
      } else {
        try {
          const newTest = await DAO.createTemplate({
            title,
            template: cleanCode,
            category: category,
          });

          dispatch({ type: 'add_test', payload: newTest });
          dispatch({ type: 'set_modal_state', payload: { open: false } });
        } catch {
          snackbar.error('Failed to create test, please try after some time');
        }
      }
      // need work
      snackbar.success('Snippet saved!');
    }
  }, [validate, code, editItemId, title, category, dispatch]);

  const onDelete = useCallback(async () => {
    if (busy) return;
    if (!editItemId) return;

    setBusy(true);

    try {
      await DAO.deleteTemplate(editItemId);
      dispatch({ type: 'delete_test', payload: editItemId });
      dispatch({ type: 'set_modal_state', payload: { open: false } });
      router.invalidate();
      snackbar.success('Test deleted successfully');
    } catch {
      snackbar.error('Snippet deletion failed');
    } finally {
      setBusy(false);
    }
  }, [busy, editItemId, dispatch, router]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    const target = e.target as HTMLTextAreaElement;
    const key = e.key;

    if (key === 'Tab') {
      if (e.shiftKey) {
        unindentSelection(target);
      } else {
        indentSelection(target);
      }
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    setTitle(editItem?.title || '');
    setCode(editItem?.template || '');
    setCategory(editItem?.category || 1);
  }, [editItem?.title, editItem?.template, editItem?.category]);

  useEffect(() => {
    if (open && mode === 'create') {
      setTitle('');
      setCode('');
    }
  }, [open, mode]);

  useEffect(() => {
    enableTabToIndent('textarea');
  }, []);

  return (
    <Dialog.Root open={open}>
      <Dialog.Content maxWidth="800px" className="font-code">
        <Dialog.Title className="font-code">
          {mode === 'edit' ? 'Update code snippet' : 'Add new snippet'}
        </Dialog.Title>
        <Flex direction="column" gap="2" mb="2">
          <Text as="div" size="2" mb="1" weight="bold">
            Category
          </Text>
          <Categories category={category} setCategory={setCategory} />
        </Flex>
        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Title
            </Text>
            <Text as="p" size={'2'} mb={'2'} color="gray">
              Enter a title between 10 and 50 characters long
            </Text>
            <TextField.Root
              placeholder="Enter title for new code snippet"
              value={title}
              onChange={onTitleChange}
              className="[&>input]:font-code [&>input]:font-bold"
              maxLength={50}
            ></TextField.Root>
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Snippet
            </Text>
            <Text as="p" size={'2'} mb={'2'} color="gray">
              Enter a code snippet. For best typing experience do not enter text
              with very long lines and keep the overall line count under 30
            </Text>
            <TextArea
              id="code-input"
              placeholder="console.log('Hello world!')"
              rows={18}
              className="[&>textarea]:font-code [&>textarea]:whitespace-pre [&>textarea]:font-bold"
              value={code}
              onChange={onCodeChange}
              onKeyDown={onKeyDown}
            />
          </label>
        </Flex>

        <Flex mt="4" justify="between">
          <div>
            <If condition={mode === 'edit'}>
              <Then>
                <Button
                  variant="soft"
                  color="red"
                  onClick={onDelete}
                  className="font-code"
                >
                  Delete
                </Button>
              </Then>
            </If>
          </div>
          <Flex gap={'3'}>
            <Button
              variant="soft"
              color="gray"
              onClick={() =>
                dispatch({ type: 'set_modal_state', payload: { open: false } })
              }
              className="font-code"
            >
              Cancel
            </Button>
            <Button onClick={onSave} className="font-code">
              Save
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export const EditPopup = memo(EditPopupImpl);
