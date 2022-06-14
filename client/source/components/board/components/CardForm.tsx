import { AdderForm } from "./AdderForm";

interface CardFormProps {
  onConfirm: (title: string) => void;
  onCancel: () => void;
}

export const CardForm = ({ onConfirm, onCancel }: CardFormProps) => {
  return (
    <AdderForm
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmText={"Add card"}
      inputProps={{ placeholder: "Enter a title for this card..." }}
    />
  );
};
