import { Skeleton, SkeletonProps, Stack } from "@chakra-ui/react";

interface ProjectListProps extends SkeletonProps {}

export const ProjectList = ({ isLoaded = false, children }: ProjectListProps) => {
  if (!isLoaded) {
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  }

  return <Stack spacing={0}>{children}</Stack>;
};
