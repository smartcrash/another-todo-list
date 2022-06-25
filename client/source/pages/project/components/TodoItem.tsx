import { Box, Checkbox, EditableInput, EditablePreview, HStack, Text } from "@chakra-ui/react";
import { NonEmptyEditable } from "../../../components";
import { Todo } from "../../../generated/graphql";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
}

export const TodoItem = ({ todo, onUpdate }: TodoItemProps) => {
  const { content, completed } = todo;
  return (
    <Box py={1}>
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
            textDecor={completed ? "line-through" : undefined}
          >
            <EditablePreview />
            <EditableInput />
          </NonEmptyEditable>
        </Box>
      </HStack>
    </Box>
  );
};
