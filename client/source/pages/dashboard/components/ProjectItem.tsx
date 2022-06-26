import { Box, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from "@chakra-ui/react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Project } from "../../../generated/graphql";
import { useHover } from "../../../hooks";
import { ArchiveIcon, DotsHorizontalIcon, TrashIcon } from "../../../icons";
import { route } from "../../../routes";

// NOTE: Remove `todo` property from Project type to fix
//       errors from type mismatch between return values
//       of `allProject` and `finProjectBySlug`.
//       `finProjectBySlug` has the `todo` property and `allProject` Query don't
// FIXME: Find a better way to fix this
interface ProjectItemProps<P = Omit<Project, "todos">> {
  project: P;
  onDelete?: (project: P) => void;
  onRestore?: (project: P) => void;
}

export const ProjectItem = ({ project, onDelete = () => {}, onRestore = () => {} }: ProjectItemProps) => {
  const hoverRef = useRef<HTMLDivElement>(null);
  const isHover = useHover(hoverRef);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { title, slug, deletedAt } = project;

  return (
    <Link
      to={route("project", { slug })}
      style={{ cursor: deletedAt ? "default" : undefined }}
      onClick={(event) => {
        // NOTE: Prevent redirection if the project is deleted
        if (deletedAt) event.preventDefault();
      }}
    >
      <Box
        px={3}
        mx={-3}
        py={1.5}
        pr={12}
        borderRadius={"sm"}
        bg={isHover || isOpen ? "gray.200" : undefined}
        position={"relative"}
        ref={hoverRef}
        data-testid={`project-item`}
      >
        <Text noOfLines={1}>{title}</Text>

        <Box
          hidden={!isHover && !isOpen}
          position={"absolute"}
          top={"2px"}
          right={0}
          // NOTE: This prevent redirection when <MenuButton/> is clicked
          onClick={(event) => event.preventDefault()}
        >
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
                data-testid={"delete-project"}
              >
                Delete project
              </MenuItem>

              <MenuItem
                onClick={() => onRestore(project)}
                icon={<ArchiveIcon />}
                // NOTE: Only show this button if it was soft-deleted
                hidden={!deletedAt}
                data-testid={"restore-project"}
              >
                Restore project
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
    </Link>
  );
};
