import React from "react";
import Modal from "./Modal";
import MealForm from "./MealForm";
import { useRouter } from "next/navigation";

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMealModal({ isOpen, onClose }: AddMealModalProps) {
  const router = useRouter();

  // Função para atualizar a página após adicionar uma refeição
  const handleMealAdded = () => {
    onClose();
    router.refresh();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Refeição">
      <p className="text-gray-600 mb-6">
        Preencha o formulário abaixo para adicionar uma nova refeição.
      </p>
      <MealForm onSuccess={handleMealAdded} />
    </Modal>
  );
}
