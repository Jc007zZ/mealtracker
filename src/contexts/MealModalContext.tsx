"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

type MealModalContextType = {
  isAddMealModalOpen: boolean;
  openAddMealModal: () => void;
  closeAddMealModal: () => void;
};

const MealModalContext = createContext<MealModalContextType | undefined>(
  undefined
);

export function MealModalProvider({ children }: { children: ReactNode }) {
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);

  const openAddMealModal = () => setIsAddMealModalOpen(true);
  const closeAddMealModal = () => setIsAddMealModalOpen(false);

  return (
    <MealModalContext.Provider
      value={{
        isAddMealModalOpen,
        openAddMealModal,
        closeAddMealModal,
      }}
    >
      {children}
    </MealModalContext.Provider>
  );
}

export function useMealModal() {
  const context = useContext(MealModalContext);
  if (context === undefined) {
    throw new Error("useMealModal must be used within a MealModalProvider");
  }
  return context;
}
