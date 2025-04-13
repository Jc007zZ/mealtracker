"use client";

import { useState, useEffect, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import MealCard from "@/components/MealCard";
import { MealType } from "@/models/Meal";
import NutritionSummary from "@/components/NutritionSummary";
import { Toaster } from "react-hot-toast";
import { useMealModal } from "@/contexts/MealModalContext";

interface CaloriesByType {
  [key: string]: number;
}

interface StatsData {
  totalCalories: number;
  caloriesByType: CaloriesByType;
  mealCount: number;
}

// Obter a data atual no formato YYYY-MM-DD para uso consistente
function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Dashboard() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { openAddMealModal } = useMealModal();

  const formattedToday = getTodayDateString();

  const [selectedDate, setSelectedDate] = useState(formattedToday);
  const [selectedType, setSelectedType] = useState("");
  const [stats, setStats] = useState<StatsData>({
    totalCalories: 0,
    caloriesByType: {},
    mealCount: 0,
  });

  const mealTypes = Object.values(MealType);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let url = `/api/meals?date=${selectedDate}`;
      if (selectedType) {
        url += `&type=${encodeURIComponent(selectedType)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erro ao buscar refeições");
      }

      const data = await response.json();

      setMeals(data);
      console.log('aaaaaaaaaaaaaaaa')
      console.log(data)
    } catch (error) {
      console.error("Erro ao buscar refeições:", error);
      setError("Erro ao buscar refeições. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedType]);

  const fetchStats = useCallback(async () => {
    try {
      console.log("Fetching stats for date:", selectedDate);
      const response = await fetch(`/api/stats/calories?date=${selectedDate}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar estatísticas");
      }

      const data = await response.json();
      console.log("Estatísticas recebidas:", data);
      setStats(data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchMeals();
    fetchStats();
  }, [fetchMeals, fetchStats]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchMeals();
      fetchStats();
    };

    window.addEventListener("refreshDashboard", handleRefresh);

    return () => {
      window.removeEventListener("refreshDashboard", handleRefresh);
    };
  }, [fetchMeals, fetchStats]);

  const handleDelete = () => {
    fetchMeals();
    fetchStats();
  };

  // Usar parseISO para garantir que a data seja interpretada corretamente
  const displayDate = parseISO(selectedDate);
  const formattedDate = format(displayDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return (
    <div>
      <Toaster position="top-right" />

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Gerencie suas refeições diárias e controle suas calorias.
          </p>
        </div>

        <button
          onClick={openAddMealModal}
          className="bg-gray-900 py-3 px-5 rounded-md text-white cursor-pointer hover:bg-gray-900/80"
        >
          Adicionar refeição
        </button>
        
      </div>

      {/* Resumo Nutricional */}
      {meals.length > 0 && (
        <NutritionSummary meals={meals} date={displayDate} />
      )}

      {/* Filtros e estatísticas */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {formattedDate}
            </h2>
            <p className="text-gray-600">
              Tipos  de Refeições:{" "}
              <span className="font-semibold">{stats.totalCalories}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            /> */}

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Todos os tipos</option>
              {mealTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Estatísticas por tipo de refeição */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mealTypes.map((type) => {
            const calories = stats.caloriesByType[type] || 0;
            let bgColor = "";

            switch (type) {
              case MealType.BREAKFAST:
                bgColor = "bg-amber-50 border-amber-200";
                break;
              case MealType.LUNCH:
                bgColor = "bg-green-50 border-green-200";
                break;
              case MealType.SNACK:
                bgColor = "bg-purple-50 border-purple-200";
                break;
              case MealType.DINNER:
                bgColor = "bg-blue-50 border-blue-200";
                break;
            }

            return (
              <div key={type} className={`p-4 rounded-lg border ${bgColor}`}>
                <p className="text-sm font-medium text-gray-600">{type}</p>
                <p className="text-xl font-semibold">{calories} calorias</p>
              </div>
            );
          })}
        </div> */}
      </div>

      {/* Lista de refeições */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Suas refeições Diarias
        </h2>

        <div className="mb-4 flex justify-end">
          <button
            onClick={() => {
              fetchMeals();
              fetchStats();
            }}
            className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 transition flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Atualizar
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="spinner"></div>
            <p className="mt-2 text-gray-600">Carregando refeições...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">
              Nenhuma refeição encontrada para esta data e filtro.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal: any) => (
              <MealCard key={meal._id} meal={meal} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
