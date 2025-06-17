/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Button,
  Dialog,
  Flex,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DAO } from '~/utils/dao';
import { ActionDispatcher, State } from '~/state';
import { If, Then } from 'react-if';
import { snackbar } from '~/utils/snackbars';

type PopupProps = State['modalState'] & {
  dispatch: ActionDispatcher;
};

export function EditPopup(props: PopupProps) {
  const { open, editItem, mode, dispatch } = props;

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

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

  const onCodeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = (e.target as HTMLTextAreaElement).selectionStart;
        const end = (e.target as HTMLTextAreaElement).selectionEnd;
        const value = (e.target as HTMLTextAreaElement).value;
        (e.target as HTMLTextAreaElement).value =
          value.slice(0, start) + '    ' + value.slice(end);
        (e.target as HTMLTextAreaElement).selectionStart = start + 2;
        (e.target as HTMLTextAreaElement).selectionEnd = start + 2;
        setCode((e.target as HTMLTextAreaElement).value);
      }
    },
    []
  );

  const validate = useCallback(() => {
    if (title.length < 10) {
      snackbar.error('Title should be at least 10 characters long');
      return false;
    }

    if (code.length < 10) {
      snackbar.error('Code should be at least 10 characters long');
      return false;
    }

    return true;
  }, [title, code]);

  const onSave = useCallback(async () => {
    if (validate()) {
      const cleanCode = (code || '')
        .replaceAll('\n\n', '\n')
        .split('\n')
        .map(line => line.trimEnd())
        .filter(line => line !== '')
        .join('\n');

      if (editItemId) {
        const curr = await DAO.getTemplate(editItemId);
        const updated = { ...curr, title, template: cleanCode };

        try {
          await DAO.updateTemplate(
            updated as { uuid: string; title: string; template: string }
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
  }, [editItemId, validate, code, title, dispatch]);

  const onDelete = useCallback(async () => {
    if (busy) return;
    if (!editItemId) return;

    setBusy(true);

    try {
      await DAO.deleteTemplate(editItemId);
      dispatch({ type: 'delete_test', payload: editItemId });
      dispatch({ type: 'set_modal_state', payload: { open: false } });
      snackbar.success('Test deleted successfully');
    } catch {
      snackbar.error('Snippet deletion failed');
    } finally {
      setBusy(false);
    }
  }, [busy, editItemId, dispatch]);

  useEffect(() => {
    setTitle(editItem?.title || '');
    setCode(editItem?.template || '');
  }, [editItem?.title, editItem?.template]);

  useEffect(() => {
    if (open && mode === 'create') {
      setTitle('');
      setCode('');
    }
  }, [open, mode]);

  return (
    <Dialog.Root open={open}>
      <Dialog.Content maxWidth="800px" className="font-code">
        <Dialog.Title className="font-code">
          {mode === 'edit' ? 'Update code snippet' : 'Add new snippet'}
        </Dialog.Title>
        <Dialog.Description></Dialog.Description>
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
              placeholder="console.log('Hello world!')"
              rows={24}
              className="[&>textarea]:font-code [&>textarea]:whitespace-pre [&>textarea]:font-bold"
              value={code}
              onChange={onCodeChange}
              onKeyDown={onCodeKeyDown}
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
