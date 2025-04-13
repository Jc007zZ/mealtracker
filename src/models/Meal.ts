import mongoose, { Schema } from "mongoose";

export enum MealType {
  BREAKFAST = "Café da manhã",
  LUNCH = "Almoço",
  SNACK = "Lanche da tarde",
  DINNER = "Janta",
}

export interface IMeal {
  name: string;
  description: string;
  calories: number;
  carbs: number; // Carboidratos em gramas
  fats: number; // Gorduras em gramas
  proteins: number; // Proteínas em gramas
  price: number; // Preço em reais
  dateTime: Date;
  type: MealType;
  daily: boolean;
  check: boolean;
  userId: string;
}

const MealSchema = new Schema<IMeal>(
  {
    name: {
      type: String,
      required: [true, "Nome da refeição é obrigatório"],
    },
    description: {
      type: String,
      required: [true, "Descrição é obrigatória"],
    },
    calories: {
      type: Number,
      required: [true, "Calorias são obrigatórias"],
      min: [0, "Calorias devem ser um número positivo"],
    },
    carbs: {
      type: Number,
      default: 0,
      min: [0, "Carboidratos devem ser um número positivo"],
    },
    fats: {
      type: Number,
      default: 0,
      min: [0, "Gorduras devem ser um número positivo"],
    },
    proteins: {
      type: Number,
      default: 0,
      min: [0, "Proteínas devem ser um número positivo"],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Preço deve ser um número positivo"],
    },
    dateTime: {
      type: Date,
      required: [true, "Data e hora são obrigatórios"],
    },
    type: {
      type: String,
      enum: Object.values(MealType),
      required: [true, "Tipo de refeição é obrigatório"],
    },
    daily: {
      type: Boolean,
      default: false, 
    },
    check: {
      type: Boolean,
      default: false, 
    },
    userId: {
      type: String,
      required: [true, "UserID é obrigatório"],
    },
  },
  {
    timestamps: true,
  }
);

// Verificar se o modelo já existe para evitar erros de redefinição de modelo
const Meal = mongoose.models?.Meal || mongoose.model<IMeal>("Meal", MealSchema);

export default Meal;
