import { AddIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { ProjectForm } from "./ProjectForm";

interface ProjectAdderProps {
  onConfirm: (title: string) => void;
}

export const ProjectAdder = ({ onConfirm }: ProjectAdderProps) => {
  const [isAddingProject, setAddingProject] = useState(false);

  function confirmProject(title: string) {
    onConfirm(title);
    setAddingProject(false);
  }

  return isAddingProject ? (
    <ProjectForm onConfirm={confirmProject} onCancel={() => setAddingProject(false)} />
  ) : (
    <Button
      colorScheme={"blackAlpha"}
      variant={"link"}
      size={"sm"}
      onClick={() => setAddingProject(true)}
      leftIcon={<AddIcon fontSize={"xs"} />}
      data-testid={"add-project"}
    >
      Add project
    </Button>
  );
};
