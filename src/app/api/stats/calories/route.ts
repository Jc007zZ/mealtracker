import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Meal from "@/models/Meal";

// Verifica se a conexão está ativa antes de cada requisição
async function ensureConnection() {
  try {
    await dbConnect();
    return true;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    return false;
  }
}

// GET /api/stats/calories - Obtém total de calorias para uma data específica
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const connectionSuccessful = await ensureConnection();
    if (!connectionSuccessful) {
      return NextResponse.json(
        { error: "Erro de conexão com o banco de dados" },
        { status: 500 }
      );
    }

    const url = new URL(req.url);
    const date =
      url.searchParams.get("date") || new Date().toISOString().split("T")[0];

    const dateOnly = date.split("T")[0];

    // Busca todas as refeições do usuário para a data especificada
    const meals = await Meal.find({
      userId: session.user.id,
      dateTime: {
        $gte: new Date(`${dateOnly}T00:00:00.000Z`),
        $lt: new Date(`${dateOnly}T23:59:59.999Z`),
      },
    });

    console.log(
      `API Stats - Encontradas ${meals.length} refeições para estatísticas`
    );

    // Para debug, mostrar as refeições encontradas
    if (meals.length > 0) {
      meals.forEach((meal, index) => {
        console.log(`Refeição #${index + 1}:`);
        console.log("  ID:", meal._id);
        console.log("  Nome:", meal.name);
        console.log("  Tipo:", meal.type);
        console.log("  Data/Hora:", new Date(meal.dateTime).toISOString());
        console.log("  Calorias:", meal.calories);
      });
    }

    // Calcula o total de calorias
    // const totalCalories = meals.reduce(
    //   (total, meal) => total + meal.calories,
    //   0
    // );

    // Calcula calorias por tipo de refeição
    const caloriesByType = meals.reduce(
      (result: { [key: string]: number }, meal) => {
        const type = meal.type;
        if (!result[type]) {
          result[type] = 0;
        }
        result[type] += meal.calories;
        return result;
      },
      {}
    );

    const response = {
      date,
      // totalCalories,
      caloriesByType,
      mealCount: meals.length,
    };

    console.log("API Stats - Resposta:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro ao calcular estatísticas de calorias:", error);
    return NextResponse.json(
      { error: "Erro ao calcular estatísticas" },
      { status: 500 }
    );
  }
}
