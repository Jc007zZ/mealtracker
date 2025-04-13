"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MealForm from "@/components/MealForm";
import { IMeal } from "@/models/Meal";

export default function EditMeal() {
  const params = useParams();
  const [meal, setMeal] = useState<
    (Omit<IMeal, "dateTime"> & { dateTime: string; _id: string }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await fetch(`/api/meals/${params.id}`);

        if (!response.ok) {
          throw new Error("Erro ao buscar dados da refeição");
        }

        const data = await response.json();
        setMeal(data);
      } catch (error) {
        console.error("Erro ao buscar refeição:", error);
        setError(
          "Não foi possível carregar os dados da refeição. Tente novamente."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [params.id]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Editar refeição
        </h1>
        <p className="text-gray-600">Edite os dados da refeição selecionada.</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-600">Carregando dados da refeição...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : meal ? (
        <MealForm meal={meal} isEdit={true} />
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Refeição não encontrada
        </div>
      )}
    </div>
  );
}
