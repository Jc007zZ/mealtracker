"use client";

import React, { useCallback } from "react";
import Navbar from "./Navbar";
import AddMealModal from "./AddMealModal";
import { useMealModal } from "@/contexts/MealModalContext";
import { usePathname } from "next/navigation";

// Hook personalizado para disparar um evento que notifica a dashboard para atualizar
function useRefreshDashboard() {
  // Criar um evento personalizado para refresh da dashboard
  const triggerRefresh = useCallback(() => {
    // Usar um evento personalizado para notificar componentes que precisam ser atualizados
    const event = new CustomEvent("refreshDashboard");
    window.dispatchEvent(event);
  }, []);

  return { triggerRefresh };
}

function GlobalMealModal() {
  const { isAddMealModalOpen, closeAddMealModal } = useMealModal();
  const { triggerRefresh } = useRefreshDashboard();

  // Combine o fechamento do modal com o recarregamento da dashboard
  const handleClose = useCallback(() => {
    closeAddMealModal();
    triggerRefresh();
  }, [closeAddMealModal, triggerRefresh]);

  return <AddMealModal isOpen={isAddMealModalOpen} onClose={handleClose} />;
}

export default function ProtectedLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-6">{children}</main>
      <GlobalMealModal />
    </>
  );
}
