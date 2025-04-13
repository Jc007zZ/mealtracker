"use client";

import { useEffect, useState } from "react";
import { IMeal } from "@/models/Meal";
import { IGoal } from "@/models/Goal";
import DailyCaloriesCard from "./DailyCaloriesCard";
import MacroDistributionCard from "./MacroDistributionCard";

type NutritionSummaryProps = {
  meals: (IMeal & { _id: string })[];
  date: Date;
};

export default function NutritionSummary({
  meals,
  date,
}: NutritionSummaryProps) {
  const [goals, setGoals] = useState<IGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

 const mealsCheck = meals.filter(item => item.check === true)

  // Calcular totais para o dia
  const totals = mealsCheck.reduce(
    (acc, meal) => {
      return {
        calories: acc.calories + (meal.calories || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fats: acc.fats + (meal.fats || 0),
        proteins: acc.proteins + (meal.proteins || 0),
      };
    },
    { calories: 0, carbs: 0, fats: 0, proteins: 0 }
  );

  // Carregar metas do usuário
  useEffect(() => {
    async function loadGoals() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/goals");

        if (!response.ok) {
          throw new Error("Erro ao carregar metas");
        }

        const data = await response.json();
        setGoals(data);
      } catch (error) {
        console.error("Erro ao carregar metas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadGoals();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-4">Carregando resumo nutricional...</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <DailyCaloriesCard
        calories={totals.calories}
        calorieGoal={goals?.calories || 2000}
      />

      <MacroDistributionCard
        carbs={totals.carbs}
        proteins={totals.proteins}
        fats={totals.fats}
        carbsGoal={goals?.carbs || 250}
        proteinsGoal={goals?.proteins || 150}
        fatsGoal={goals?.fats || 65}
      />
    </div>
  );
}
