"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MealType, IMeal } from "@/models/Meal";
import { format, parseISO } from "date-fns";

type MealFormData = {
  name: string;
  description: string;
  calories: number;
  carbs: number;
  fats: number;
  proteins: number;
  price: number;
  dateTime: string;
  type: MealType;
};

type MealFormProps = {
  meal?: Omit<IMeal, "dateTime"> & { dateTime: string; _id?: string };
  isEdit?: boolean;
  onSuccess?: () => void;
};

// Função para garantir que a data esteja no formato ISO, compatível com o filtro do MongoDB
function ensureISOString(dateTime: Date | string): string {
  try {
    // Se for uma string ou objeto Date, converter para Date e depois para ISO string
    const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime;

    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      console.warn("Data inválida:", dateTime);
      return new Date().toISOString(); // Fallback para a data atual
    }

    // Obter a data no formato ISO para garantir consistência
    const isoString = date.toISOString();
    console.log("Data convertida para ISO:", isoString);
    return isoString;
  } catch (error) {
    console.error("Erro ao processar data:", error);
    return new Date().toISOString(); // Fallback para a data atual
  }
}

export default function MealForm({
  meal,
  isEdit = false,
  onSuccess,
}: MealFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Inicializar com a data e hora atual no formato ISO
  const now = new Date();
  const initialDateTime = now.toISOString();

  const [formData, setFormData] = useState<MealFormData>({
    name: "",
    description: "",
    calories: 0,
    carbs: 0,
    fats: 0,
    proteins: 0,
    price: 0,
    dateTime: initialDateTime,
    type: MealType.BREAKFAST,
  });

  useEffect(() => {
    if (meal) {
      // Garantir que dateTime seja uma ISO string válida
      const safeDateTime = ensureISOString(meal.dateTime);

      setFormData({
        name: meal.name,
        description: meal.description,
        calories: meal.calories,
        carbs: meal.carbs || 0,
        fats: meal.fats || 0,
        proteins: meal.proteins || 0,
        price: meal.price || 0,
        dateTime: safeDateTime,
        type: meal.type,
      });
    }
  }, [meal]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (
      name === "calories" ||
      name === "carbs" ||
      name === "fats" ||
      name === "proteins" ||
      name === "price"
    ) {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else if (name === "dateTime") {
      try {
        // Para campos de data/hora, garantir que o valor seja armazenado como ISO string
        // Garantir que a data é válida antes de convertê-la
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          // Log do valor antes da conversão
          console.log("Valor de data recebido do input:", value);

          // Converter para ISO string compatível com o filtro do backend
          const isoString = date.toISOString();
          console.log("Convertido para ISO string:", isoString);

          setFormData({
            ...formData,
            [name]: isoString,
          });
        } else {
          console.error("Data inválida:", value);
        }
      } catch (error) {
        console.error("Erro ao processar data:", error);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    try {
      // Garantir que estamos lidando com uma data válida
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) {
        throw new Error("Data inválida");
      }
      return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      // Retornar string vazia para evitar erros no input datetime-local
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Garantir que todas as datas estão no formato correto
      const dataToSubmit = {
        ...formData,
        dateTime: ensureISOString(formData.dateTime),
      };

      let url = "/api/meals";
      let method = "POST";

      if (isEdit && meal?._id) {
        url = `/api/meals/${meal._id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao salvar refeição");
      }

      // Aguardar resposta e dados
      const savedMeal = await response.json();
      console.log("Refeição salva com sucesso:", savedMeal);
      console.log(
        "Data/Hora salva:",
        new Date(savedMeal.dateTime).toISOString()
      );

      // Se onSuccess for fornecido, chamá-lo
      if (onSuccess) {
        onSuccess();
      } else {
        // Comportamento padrão: redirecionamento
        setTimeout(() => {
          router.push(`/dashboard?t=${Date.now()}`);
          router.refresh();
        }, 300);
      }
    } catch (error: any) {
      console.error("Erro ao salvar refeição:", error);
      setError(error.message || "Erro ao salvar refeição. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
          Nome da refeição*
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-medium mb-2"
        >
          Descrição*
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="calories"
          className="block text-gray-700 font-medium mb-2"
        >
          Calorias*
        </label>
        <input
          type="number"
          id="calories"
          name="calories"
          value={formData.calories}
          onChange={handleChange}
          required
          min={0}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
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
          />
        </div>
        <div>
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
          />
        </div>
        <div>
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
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
          Preço (R$)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min={0}
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="dateTime"
          className="block text-gray-700 font-medium mb-2"
        >
          Data e hora*
        </label>
        <input
          type="datetime-local"
          id="dateTime"
          name="dateTime"
          value={formData.dateTime ? formatDateTime(formData.dateTime) : ""}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
          Tipo de refeição*
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {Object.values(MealType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
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
          className="px-4 py-2 bg-primary-600 text-white cursor-pointer  bg-gray-900 hover:bg-gray-900/80 rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {isSubmitting
            ? "Salvando..."
            : isEdit
            ? "Atualizar refeição"
            : "Adicionar refeição"}
        </button>
      </div>
    </form>
  );
}
