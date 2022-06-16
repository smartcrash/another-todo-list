import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Board,
  CardClickHandler,
  CardDragEndHandler,
  CardNewHandler,
  CardRemoveHandler,
  ColumnNewHandler,
  ColumnRemoveHandler,
} from "../../../components";
import { CardDetailsModal } from "../../../components/CardDetailsModal";
import {
  useAddCardMutation,
  useAddColumnMutation,
  useDeleteBoardMutation,
  useFindBoardByIdQuery,
  useMoveCardMutation,
  useRemoveCardMutation,
  useRemoveColumnMutation,
  useUpdateBoardMutation,
} from "../../../generated/graphql";
import { route } from "../../../routes";
import { EditableTitle } from "./EditableTitleAndDesc";

export const ShowProject = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id!);
  const [{ data, fetching }] = useFindBoardByIdQuery({ variables: { id } });
  const [, update] = useUpdateBoardMutation();
  const [, deleteBoard] = useDeleteBoardMutation();
  const [, addColumn] = useAddColumnMutation();
  const [, addCard] = useAddCardMutation();
  const [, removeColumn] = useRemoveColumnMutation();
  const [, removeCard] = useRemoveCardMutation();
  const [, moveCard] = useMoveCardMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardIdRef = useRef<number>();

  if (fetching) return <>loading...</>; // TODO: Add skeleton
  if (!data?.board) return <>Something went wrong! :O</>;

  const { title } = data.board;

  const onDelete = async () => {
    await deleteBoard({ id });
    navigate(route("index"), { replace: true });
  };

  const onColumnNew: ColumnNewHandler = async (newColumn) => {
    const { data } = await addColumn({
      ...newColumn,
      boardId: id,
    });

    return data!.column;
  };

  const onColumnRemove: ColumnRemoveHandler = async ({ id }) => {
    await removeColumn({ id });
  };

  const onCardNew: CardNewHandler = async (newCard) => {
    const { data } = await addCard({ ...newCard });

    return data!.card;
  };

  const onCardRemove: CardRemoveHandler = async ({ id }) => {
    await removeCard({ id });
  };

  const onCardDragEnd: CardDragEndHandler = async ({ cardId, toIndex, toColumnId }) => {
    await moveCard({ id: cardId, toIndex, toColumnId });
  };

  const onCardClick: CardClickHandler = (card) => {
    cardIdRef.current = card.id;
    onOpen();
  };

  return (
    <>
      <Stack spacing={6}>
        <HStack justifyContent={"space-between"}>
          <EditableTitle defaultValue={title} onSubmit={(title) => update({ id, title })} />

          <Popover>
            <PopoverTrigger>
              <Button leftIcon={<DeleteIcon mb={1} mr={1} />} colorScheme={"gray"} variant={"ghost"}>
                Delete project
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader textAlign={"center"}>Delete project?</PopoverHeader>
              <PopoverBody>
                <VStack spacing={3}>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    You can find and reopen closed boards at the bottom of{" "}
                    <Link as={RouterLink} to={route("projects.list")} color={"gray.700"} textDecoration={"underline"}>
                      your boards page
                    </Link>
                  </Text>

                  <Button colorScheme={"red"} w={"full"} size={"sm"} onClick={onDelete} data-testid={"delete"}>
                    Delete
                  </Button>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>

        <Box>
          <Board
            onColumnNew={onColumnNew}
            onColumnRemove={onColumnRemove}
            onCardNew={onCardNew}
            onCardRemove={onCardRemove}
            onCardDragEnd={onCardDragEnd}
            onCardClick={onCardClick}
          >
            {data.board}
          </Board>
        </Box>
      </Stack>

      <CardDetailsModal id={cardIdRef.current} isOpen={isOpen} onClose={onClose} />
    </>
  );
};
