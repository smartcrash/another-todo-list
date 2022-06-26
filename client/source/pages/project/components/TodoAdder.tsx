import { AddIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { TodoForm } from "./TodoForm";

interface TodoAdderProps {
  onConfirm: (content: string) => void;
}

export const TodoAdder = ({ onConfirm }: TodoAdderProps) => {
  const [isAddingTodo, setAddingTodo] = useState(false);

  function confirmTodo(content: string) {
    onConfirm(content);
    setAddingTodo(false);
  }

  return isAddingTodo ? (
    <TodoForm onConfirm={confirmTodo} onCancel={() => setAddingTodo(false)} />
  ) : (
    <Button
      variant={"link"}
      size={"sm"}
      onClick={() => setAddingTodo(true)}
      leftIcon={<AddIcon fontSize={"xs"} />}
      data-testid={"add-todo"}
    >
      Add task
    </Button>
  );
};
