import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
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
// GET /api/meals - Lista todas as refeições do usuário
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
    const type = url.searchParams.get("type");
    const date = url.searchParams.get("date");

    const query: any = { userId: session.user.id };

    // Filtrar por tipo de refeição se fornecido
    if (type) {
      query.type = type;
    }

    // Filtrar por data se fornecida
    // if (date) {
    //   // Extrair apenas a parte da data (YYYY-MM-DD)
    //   const dateOnly = date.split("T")[0];

    //   // Criar datas UTC para o início e fim do dia
    //   // Isso garante consistência independente do fuso horário
    //   // const startDate = new Date(`${dateOnly}T00:00:00.000Z`);
    //   // const endDate = new Date(`${dateOnly}T23:59:59.999Z`);

    //   // console.log("Filtro de data - início:", startDate.toISOString());
    //   // console.log("Filtro de data - fim:", endDate.toISOString());
    //   // console.log("Data original fornecida:", date);

    //   // query.dateTime = {
    //   //   $gte: startDate,
    //   //   $lt: endDate,
    //   // };
    // }
    
    const meals = await Meal.find(query).sort({ dateTime: -1 });
    console.log(`API - Encontradas ${meals.length} refeições`);

    return NextResponse.json(meals);
  } catch (error) {
    console.error("Erro ao buscar refeições:", error);
    return NextResponse.json(
      { error: "Erro ao buscar refeições" },
      { status: 500 }
    );
  }
}

// POST /api/meals - Cria uma nova refeição
export async function POST(req: NextRequest) {
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

    // Obter e validar os dados da requisição
    const body = await req.json();

    // Log detalhado dos dados recebidos
    console.log(
      "API - Detalhes completos da refeição:",
      JSON.stringify(body, null, 2)
    );
    console.log("API - Macronutrientes recebidos:", {
      carbs: body.carbs,
      fats: body.fats,
      proteins: body.proteins,
      price: body.price,
    });

    // Verificar se dateTime está presente e é uma string
    if (!body.dateTime) {
      return NextResponse.json(
        { error: "Data e hora são obrigatórios" },
        { status: 400 }
      );
    }

    // Garantir que a data está no formato ISO e compatível com o filtro
    let dateTime = body.dateTime;
    try {
      // Converter para objeto Date e voltar para string para normalização
      const dateObj = new Date(dateTime);
      dateTime = dateObj.toISOString();
      console.log("Data normalizada para:", dateTime);
    } catch (error) {
      console.error("Erro ao normalizar data:", error);
    }

    // Criar a refeição
    const meal = await Meal.create({
      ...body,
      dateTime, // Usar a data normalizada
      userId: session.user.id,
      // Garantir que os valores numéricos sejam enviados como números
      carbs: Number(body.carbs) || 0,
      fats: Number(body.fats) || 0,
      proteins: Number(body.proteins) || 0,
      price: Number(body.price) || 0,
    });

    console.log("API - Refeição criada com sucesso:", meal._id);
    console.log(
      "API - Data/Hora salva:",
      new Date(meal.dateTime).toISOString()
    );
    console.log("API - Macronutrientes salvos:", {
      carbs: meal.carbs,
      fats: meal.fats,
      proteins: meal.proteins,
      price: meal.price,
    });

    return NextResponse.json(meal, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar refeição:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erro ao criar refeição" },
      { status: 500 }
    );
  }
}
