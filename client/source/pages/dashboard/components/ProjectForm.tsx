import { AdderForm } from "./AdderForm";

interface ProjectFormProps {
  onConfirm: (title: string) => void;
  onCancel: () => void;
}

export const ProjectForm = ({ onConfirm, onCancel }: ProjectFormProps) => {
  return (
    <AdderForm
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmText={"Add project"}
      data-testid={"project-form"}
      inputProps={{ size: "sm", bg: "white", placeholder: "Enter project title..." }}
    />
  );
};
