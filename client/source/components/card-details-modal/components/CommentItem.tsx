import { Avatar, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { CommentFragmentFragment } from "../../../generated/graphql";
import { CommentControls } from "./CommentControls";

interface CommentItemProps {
  comment: CommentFragmentFragment;
  onRemove: () => void;
}

export const CommentItem = ({ comment, onRemove }: CommentItemProps) => {
  const { content, user, createdAt } = comment;
  const [isEditing, setEditing] = useState(false);

  // TODO: Use authorization flag from server
  const canUpdate = true;
  const canDelete = true;

  const confirmEdit = (content: string) => {
    setEditing(false);
  };

  return (
    <HStack alignItems={"flex-start"} spacing={4}>
      <Avatar size={"sm"} />

      <VStack alignItems={"flex-start"} flexGrow={1}>
        {!isEditing ? (
          <>
            <HStack alignItems={"center"}>
              <Heading as="h6" size="xs" lineHeight={"shorter"}>
                {user.username}
              </Heading>
              <Text fontSize={"xs"} color={"gray.500"} lineHeight={"shorter"}>
                {createdAt}
              </Text>
            </HStack>

            <Text fontSize={"sm"} whiteSpace={"pre-wrap"} w={"full"}>
              {content}
            </Text>

            <CommentControls
              canUpdate={canUpdate}
              canDelete={canDelete}
              onEdit={() => setEditing(true)}
              onRemove={onRemove}
            />
          </>
        ) : (
          <></>
          // <CommentFrom onConfirm={confirmEdit} />
          // <AdderForm w={"full"} onConfirm={confirmEdit} onCancel={() => setEditing(false)} confirmText={"Save"} />
        )}
      </VStack>
    </HStack>
  );
};
