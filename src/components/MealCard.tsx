"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { IMeal, MealType } from "@/models/Meal";
import { useState } from "react";

// Cores para cada tipo de refeição
const typeColors: Record<MealType, string> = {
  [MealType.BREAKFAST]: "bg-amber-100 text-amber-800 border-amber-200",
  [MealType.LUNCH]: "bg-green-100 text-green-800 border-green-200",
  [MealType.SNACK]: "bg-purple-100 text-purple-800 border-purple-200",
  [MealType.DINNER]: "bg-blue-100 text-blue-800 border-blue-200",
};

type MealCardProps = {
  meal: IMeal & { _id: string };
  onDelete?: () => void;
};

export default function MealCard({ meal, onDelete }: MealCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/meals/${meal._id}`, {
        method: "DELETE",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir refeição");
      }

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Erro ao excluir refeição:", error);
      alert("Erro ao excluir refeição. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCheck = async () => {
    setIsMoving(true);

    try {
      const response = await fetch(`/api/meals/check/${meal._id}`, {
        method: "PUT",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir refeição");
      }

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      alert("Erro ao adicionar refeição");
    } finally {
      setIsMoving(false);
    }
  }

  const handleRemoveCheck= async () => {
    setIsRemoving(true);

    try {
      const response = await fetch(`/api/meals/uncheck/${meal._id}`, {
        method: "PUT",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir refeição");
      }

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      alert("Erro ao adicionar refeição");
    } finally {
      setIsRemoving(false);
    }
  }

  // Função segura para formatar datas
  const formatMealDate = (dateTimeStr: Date | string) => {
    try {
      // Converter para objeto Date se for string
      const dateObj =
        typeof dateTimeStr === "string" ? new Date(dateTimeStr) : dateTimeStr;

      // Verificar se a data é válida
      if (isNaN(dateObj.getTime())) {
        console.error("Data inválida:", dateTimeStr);
        return "Data inválida";
      }

      return format(dateObj, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error, dateTimeStr);
      return "Data inválida";
    }
  };

  const formattedDate = formatMealDate(meal.dateTime);

  return (
    <div className={`rounded-lg shadow-md overflow-hidden  hover:shadow-lg transition ${meal.check ? 'border border-green-400 bg-green-500/10' : 'border border-gray-200 bg-white'}` }>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{meal.name}</h3>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              typeColors[meal.type as MealType]
            }`}
          >
            {meal.type}
          </span>
        </div>

        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {meal.description}
        </p>

        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>{formattedDate}</span>
          <div className="text-sm text-gray-600 flex flex-wrap gap-2 mb-2">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {meal.calories} kcal
            </span>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
              Carbs: {meal.carbs}g
            </span>
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
              Gorduras: {meal.fats}g
            </span>
            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
              Proteínas: {meal.proteins}g
            </span>
            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
              R$ {meal.price?.toFixed(2)}
            </span>
          </div>
        </div>

        <div className={`pt-4 border-t flex justify-between items-center ${
    meal.check ? 'border-green-400' : 'border-gray-100'
  }`}>
          <Link
            href={`/meals/edit/${meal._id}`}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            Editar
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCheck}
              disabled={isMoving}
              className="text-green-500 hover:text-green-600 text-sm font-medium disabled:opacity-50 cursor-pointer"
            >
              {isMoving ? "Adicionando..." : "Adicionar"}
            </button>
            <button
              onClick={handleRemoveCheck}
              disabled={isRemoving}
              className="text-orange-500 hover:text-orange-600 text-sm font-medium disabled:opacity-50 cursor-pointer"
            >
              {isRemoving ? "Removendo..." : "Remover"}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
