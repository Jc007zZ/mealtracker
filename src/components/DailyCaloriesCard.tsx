import React from "react";

interface DailyCaloriesCardProps {
  calories: number;
  calorieGoal: number;
}

export default function DailyCaloriesCard({
  calories,
  calorieGoal,
}: DailyCaloriesCardProps) {
  // Calcular porcentagem para a barra de progresso (máximo 100%)
  const progressPercentage = Math.min(
    Math.round((calories / calorieGoal) * 100),
    100
  );

 
  const barColor =
  calories > calorieGoal
    ? 'bg-red-500 shadow-[0_0_10px_2px_rgba(255,0,0,0.6)]'
    : 'bg-black';


  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-2">Calorias Hoje</h2>
      <p className="text-gray-500 mb-4">Consumo total do dia</p>

      <div className="mb-4">
        <div className="text-3xl font-bold">{calories}</div>
        <div className="text-sm text-gray-500">
          de {calorieGoal} calorias diárias
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={" h-2.5 rounded-full not-first-of-type: " + barColor}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
