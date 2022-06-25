import {
  Box,
  Checkbox,
  EditableInput,
  EditablePreview,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { NonEmptyEditable } from "../../../components";
import { Todo } from "../../../generated/graphql";
import { useHover } from "../../../hooks";
import { DotsHorizontalIcon, TrashIcon } from "../../../icons";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export const TodoItem = ({ todo, onUpdate, onDelete }: TodoItemProps) => {
  const hoverRef = useRef<HTMLDivElement>(null);
  const isHover = useHover(hoverRef);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { content, completed } = todo;

  return (
    <Box py={1} position={"relative"} ref={hoverRef} pr={12}>
      <HStack alignItems={"flex-start"} spacing={3}>
        <Checkbox
          mt={1}
          defaultChecked={completed}
          onChange={(event) => onUpdate({ ...todo, completed: event.target.checked })}
          size={"lg"}
          borderColor={"gray.600"}
        />

        <Box flexGrow={1}>
          <NonEmptyEditable
            defaultValue={content}
            onSubmit={(content) => onUpdate({ ...todo, content })}
            fontSize={"sm"}
          >
            <EditablePreview textDecor={completed ? "line-through" : undefined} />
            <EditableInput />
          </NonEmptyEditable>
        </Box>
      </HStack>

      <Box hidden={!isHover && !isOpen} position={"absolute"} top={"2px"} right={0}>
        <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
          <MenuButton
            as={IconButton}
            size={"sm"}
            colorScheme={"blackAlpha"}
            variant={"ghost"}
            aria-label={"More task actions"}
            title={"More task actions"}
            icon={<DotsHorizontalIcon fontSize={"lg"} />}
          />
          <MenuList>
            <MenuItem onClick={() => onDelete(todo)} icon={<TrashIcon />} data-testid={"delete-todo"}>
              Delete task
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};
