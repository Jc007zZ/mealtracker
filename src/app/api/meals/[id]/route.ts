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

// GET /api/meals/[id] - Obtém uma refeição específica
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
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

    const meal = await Meal.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!meal) {
      return NextResponse.json(
        { error: "Refeição não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(meal);
  } catch (error) {
    console.error("Erro ao buscar refeição:", error);
    return NextResponse.json(
      { error: "Erro ao buscar refeição" },
      { status: 500 }
    );
  }
}

// PUT /api/meals/[id] - Atualiza uma refeição específica
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
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

    const body = await req.json();

    // Log detalhado dos dados recebidos
    console.log(
      "API - Detalhes da atualização:",
      JSON.stringify(body, null, 2)
    );
    console.log("API - Macronutrientes recebidos:", {
      carbs: body.carbs,
      fats: body.fats,
      proteins: body.proteins,
      price: body.price,
    });

    // Normalizar a data para garantir compatibilidade com filtros
    let dateTime = body.dateTime;
    if (dateTime) {
      try {
        // Converter para objeto Date e voltar para string para normalização
        const dateObj = new Date(dateTime);
        dateTime = dateObj.toISOString();
        console.log("Data normalizada para atualização:", dateTime);
      } catch (error) {
        console.error("Erro ao normalizar data para atualização:", error);
      }
    }

    // Preparar os dados para atualização, garantindo que os valores numéricos são números
    const updateData = {
      ...body,
      dateTime, // Usar a data normalizada
      carbs: Number(body.carbs) || 0,
      fats: Number(body.fats) || 0,
      proteins: Number(body.proteins) || 0,
      price: Number(body.price) || 0,
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
    console.log(
      "API - Data/Hora atualizada:",
      new Date(meal.dateTime).toISOString()
    );
    console.log("API - Macronutrientes atualizados:", {
      carbs: meal.carbs,
      fats: meal.fats,
      proteins: meal.proteins,
      price: meal.price,
    });

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

// DELETE /api/meals/[id] - Exclui uma refeição específica
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
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

    const meal = await Meal.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!meal) {
      return NextResponse.json(
        { error: "Refeição não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir refeição:", error);
    return NextResponse.json(
      { error: "Erro ao excluir refeição" },
      { status: 500 }
    );
  }
}
