import React from "react";

interface MacroDistributionCardProps {
  carbs: number;
  proteins: number;
  fats: number;
  carbsGoal: number;
  proteinsGoal: number;
  fatsGoal: number;
}

export default function MacroDistributionCard({
  carbs,
  proteins,
  fats,
  carbsGoal,
  proteinsGoal,
  fatsGoal,
}: MacroDistributionCardProps) {
  // Calcular percentagens para barras de progresso (máximo 100%)
  const carbsPercentage = Math.min(Math.round((carbs / carbsGoal) * 100), 100);
  const proteinsPercentage = Math.min(
    Math.round((proteins / proteinsGoal) * 100),
    100
  );
  const fatsPercentage = Math.min(Math.round((fats / fatsGoal) * 100), 100);

  const carbColor =
  carbs > carbsGoal
  ? 'bg-red-500 shadow-[0_0_10px_2px_rgba(255,0,0,0.6)]'
  : 'bg-green-500'; 

  const protColor =
  proteins > proteinsGoal
    ? 'bg-red-500 shadow-[0_0_10px_2px_rgba(255,0,0,0.6)]'
    : 'bg-blue-500';

    const fatColor =
    fats > fatsGoal
    ? 'bg-red-500 shadow-[0_0_10px_2px_rgba(255,0,0,0.6)]'
    : 'bg-yellow-500';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-2">Distribuição de Nutrientes</h2>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span>Carboidratos:</span>
            <span>
              {carbs} / {carbsGoal}g
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={"h-2.5 rounded-full " + carbColor}
              style={{ width: `${carbsPercentage}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>Proteínas:</span>
            <span>
              {proteins} / {proteinsGoal}g
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={"h-2.5 rounded-full " + protColor}
              style={{ width: `${proteinsPercentage}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>Gorduras:</span>
            <span>
              {fats} / {fatsGoal}g
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={"h-2.5 rounded-full " + fatColor}
              style={{ width: `${fatsPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
