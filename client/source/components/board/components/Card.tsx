import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { Draggable } from "react-beautiful-dnd";

interface CardProps {
  title: string;
  content: string;
  index: number;
  draggableId: string;
}

export const Card = ({ title, content, index, draggableId }: CardProps) => {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <Box
          py={3}
          px={3}
          borderWidth={1}
          bg={"white"}
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
        >
          <Stack>
            <Heading fontSize={"md"}>{title}</Heading>
            <Text fontSize={"sm"} color={"gray.500"}>
              {content}
            </Text>
          </Stack>
        </Box>
      )}
    </Draggable>
  );
};