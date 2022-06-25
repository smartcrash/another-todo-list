import { Box, Checkbox, HStack, Text } from "@chakra-ui/react";
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

        <Box>
          <Text fontSize={"sm"} textDecor={completed ? "line-through" : undefined}>
            {content}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};
