import { Divider, Stack, StackProps } from "@chakra-ui/react";

interface ProjectListProps extends StackProps {}

export const TodoList = ({ children, ...stackProps }: ProjectListProps) => {
  return (
    <Stack divider={<Divider borderColor={"gray.300"} />} data-testid={"todo-list"} {...stackProps}>
      {children}
    </Stack>
  );
};
