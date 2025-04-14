import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/auth"
import dbConnect from "@/lib/db";
import Meal from "@/models/Meal";


async function ensureConnection() {
    try {
      await dbConnect();
      return true;
    } catch (error) {
      console.error("Erro ao conectar ao banco de dados:", error);
      return false;
    }
  }


// adiciona como se tivesse comido aquilo
// /api/check/[id]
export async function PUT(
  req: NextRequest,
  { params }: any
) {
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


    // Log detalhado dos dados recebidos
    // console.log(
    //   "API - Detalhes da atualização:",
    //   JSON.stringify(body, null, 2)
    // );
    // console.log("API - Macronutrientes recebidos:", {
    //   carbs: body.carbs,
    //   fats: body.fats,
    //   proteins: body.proteins,
    //   price: body.price,
    // });

    // Normalizar a data para garantir compatibilidade com filtros
    // let dateTime = body.dateTime;
    // if (dateTime) {
    //   try {
    //     // Converter para objeto Date e voltar para string para normalização
    //     const dateObj = new Date(dateTime);
    //     dateTime = dateObj.toISOString();
    //     console.log("Data normalizada para atualização:", dateTime);
    //   } catch (error) {
    //     console.error("Erro ao normalizar data para atualização:", error);
    //   }
    // }

    // Preparar os dados para atualização, garantindo que os valores numéricos são números
    const updateData = {
      check: false,
    };

    const meal = await Meal.findOneAndUpdate(
      {
        _id: params.id,
        userId: session.user.id,
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!meal) {
      return NextResponse.json(
        { error: "Refeição não encontrada" },
        { status: 404 }
      );
    }

    console.log("API - Refeição atualizada com sucesso:", meal._id);
    // console.log(
    //   "API - Data/Hora atualizada:",
    //   new Date(meal.dateTime).toISOString()
    // );

    // console.log("API - Macronutrientes atualizados:", {
    //   carbs: meal.carbs,
    //   fats: meal.fats,
    //   proteins: meal.proteins,
    //   price: meal.price,
    // });

    return NextResponse.json(meal);
  } catch (error: any) {
    console.error("Erro ao atualizar refeição:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erro ao atualizar refeição" },
      { status: 500 }
    );
  }
}