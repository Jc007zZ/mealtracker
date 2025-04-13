"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type GoalFormData = {
  calories: number;
  carbs: number;
  fats: number;
  proteins: number;
};

export default function GoalsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<GoalFormData>({
    calories: 2000,
    carbs: 250,
    fats: 65,
    proteins: 150,
  });

  // Carregar as metas atuais
  useEffect(() => {
    async function loadGoals() {
      try {
        const response = await fetch("/api/goals", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar metas");
        }

        const data = await response.json();
        setFormData({
          calories: data.calories || 2000,
          carbs: data.carbs || 250,
          fats: data.fats || 65,
          proteins: data.proteins || 150,
        });
      } catch (error) {
        console.error("Erro ao carregar metas:", error);
        setError("Falha ao carregar suas metas atuais. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    }

    loadGoals();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/goals", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao salvar metas");
      }

      toast.success("Metas salvas com sucesso!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("Erro ao salvar metas:", error);
      setError(error.message || "Erro ao salvar metas. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Carregando suas metas...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Definir Metas Diárias</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="calories"
            className="block text-gray-700 font-medium mb-2"
          >
            Calorias (kcal)
          </label>
          <input
            type="number"
            id="calories"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            min={0}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="carbs"
            className="block text-gray-700 font-medium mb-2"
          >
            Carboidratos (g)
          </label>
          <input
            type="number"
            id="carbs"
            name="carbs"
            value={formData.carbs}
            onChange={handleChange}
            min={0}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="proteins"
            className="block text-gray-700 font-medium mb-2"
          >
            Proteínas (g)
          </label>
          <input
            type="number"
            id="proteins"
            name="proteins"
            value={formData.proteins}
            onChange={handleChange}
            min={0}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="fats"
            className="block text-gray-700 font-medium mb-2"
          >
            Gorduras (g)
          </label>
          <input
            type="number"
            id="fats"
            name="fats"
            value={formData.fats}
            onChange={handleChange}
            min={0}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary-600 text-white cursor-pointer bg-gray-900 hover:bg-gray-900/80 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {isSubmitting ? "Salvando..." : "Salvar Metas"}
          </button>
        </div>
      </form>
    </div>
  );
}
