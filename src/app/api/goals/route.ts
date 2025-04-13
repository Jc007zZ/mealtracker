import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Goal from "@/models/Goal";

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

// GET /api/goals - Obtém as metas do usuário
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

    // Procurar a meta do usuário atual
    let goal = await Goal.findOne({ userId: session.user.id });

    // Se o usuário não tiver metas ainda, criar com valores padrão
    if (!goal) {
      goal = await Goal.create({
        userId: session.user.id,
        // Valores padrão são definidos no esquema
      });
      console.log("Criadas metas padrão para o usuário:", session.user.id);
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Erro ao buscar metas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar metas" },
      { status: 500 }
    );
  }
}

// PUT /api/goals - Atualiza as metas do usuário
export async function PUT(req: NextRequest) {
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
    console.log("Atualizando metas do usuário:", body);

    // Garantir que todos os valores são números
    const updateData = {
      calories: Number(body.calories) || 0,
      carbs: Number(body.carbs) || 0,
      fats: Number(body.fats) || 0,
      proteins: Number(body.proteins) || 0,
    };

    // Buscar e atualizar as metas, ou criar se não existirem
    const goal = await Goal.findOneAndUpdate(
      { userId: session.user.id },
      updateData,
      {
        new: true, // Retornar o documento atualizado
        upsert: true, // Criar se não existir
        runValidators: true,
      }
    );

    console.log("Metas atualizadas com sucesso:", goal);
    return NextResponse.json(goal);
  } catch (error: any) {
    console.error("Erro ao atualizar metas:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erro ao atualizar metas" },
      { status: 500 }
    );
  }
}
