import { AdderForm } from "../../../components";

interface TodoFormProps {
  onConfirm: (content: string) => void;
  onCancel: () => void;
}

export const TodoForm = ({ onConfirm, onCancel }: TodoFormProps) => {
  return (
    <AdderForm
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmText={"Add task"}
      data-testid={"todo-form"}
      inputProps={{ size: "sm", bg: "white", placeholder: "Task name" }}
    />
  );
};
