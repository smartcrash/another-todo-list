import { Box, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from "@chakra-ui/react";
import { useRef } from "react";
import { Project } from "../../../generated/graphql";
import { useHover } from "../../../hooks";
import { ArchiveIcon, DotsHorizontalIcon, TrashIcon } from "../../../icons";

interface ProjectItemProps {
  project: Project;
  onDelete?: (project: Project) => void;
  onRestore?: (project: Project) => void;
}

export const ProjectItem = ({ project, onDelete = () => {}, onRestore = () => {} }: ProjectItemProps) => {
  const hoverRef = useRef<HTMLDivElement>(null);
  const isHover = useHover(hoverRef);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { title, deletedAt } = project;

  return (
    <Box
      px={3}
      mx={-2}
      py={1.5}
      borderRadius={"sm"}
      bg={isHover || isOpen ? "gray.200" : undefined}
      position={"relative"}
      ref={hoverRef}
    >
      <Text>{title}</Text>

      <Box hidden={!isHover && !isOpen} position={"absolute"} top={"2px"} right={0}>
        <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
          <MenuButton
            as={IconButton}
            size={"sm"}
            colorScheme={"blackAlpha"}
            variant={"ghost"}
            aria-label={"More project actions"}
            title={"More project actions"}
            icon={<DotsHorizontalIcon fontSize={"lg"} />}
          />
          <MenuList>
            <MenuItem
              onClick={() => onDelete(project)}
              icon={<TrashIcon />}
              // NOTE: Don't show this button if is already deleted
              hidden={!!deletedAt}
            >
              Delete project
            </MenuItem>

            <MenuItem
              onClick={() => onRestore(project)}
              icon={<ArchiveIcon />}
              // NOTE: Only show this button if it was soft-deleted
              hidden={!deletedAt}
            >
              Restore project
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};
