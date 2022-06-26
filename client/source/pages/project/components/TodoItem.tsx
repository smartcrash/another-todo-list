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
  Show,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { format } from "date-fns";
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
  const completedAt = todo.completedAt ? new Date(parseInt(todo.completedAt)) : undefined;
  const formatedCompletedAt = completedAt && format(completedAt, "MMM d p");

  return (
    <Tooltip
      label={`Completed on: ${formatedCompletedAt}`}
      isDisabled={!completed}
      hasArrow
      bg={"white"}
      color={"gray.900"}
      placement={"auto-start"}
    >
      <Box
        py={2}
        position={"relative"}
        ref={hoverRef}
        pr={12}
        pl={4}
        ml={-4}
        data-testid={"todo-item"}
        bg={isHover || isOpen ? "gray.100" : undefined}
        borderRadius={"md"}
      >
        <HStack alignItems={"flex-start"} spacing={3}>
          <Checkbox
            mt={1}
            defaultChecked={completed}
            colorScheme={"primary"}
            onChange={(event) => onUpdate({ ...todo, completed: event.target.checked })}
            size={"lg"}
            borderColor={"gray.600"}
            isDisabled={completed}
          />

          <Box flexGrow={1}>
            <NonEmptyEditable
              defaultValue={content}
              onSubmit={(content) => onUpdate({ ...todo, content })}
              fontSize={"sm"}
            >
              <EditablePreview
                textDecor={completed ? "line-through" : undefined}
                cursor={"default"}
                // This disable edition if the task is completed
                pointerEvents={completed ? "none" : undefined}
              />
              <EditableInput />
            </NonEmptyEditable>

            {/* NOTE: Only show this on mobile devices */}
            <Show below={"sm"}>
              <Text fontSize={"xs"} color={"gray.500"} hidden={!completed}>
                Completed on: {formatedCompletedAt}
              </Text>
            </Show>
          </Box>
        </HStack>

        <Box
          hidden={completed || (!isHover && !isOpen)}
          position={"absolute"}
          top={"6px"}
          right={2}
          onClick={(event) => event.preventDefault()}
        >
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
    </Tooltip>
  );
};
