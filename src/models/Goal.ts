import mongoose, { Schema } from "mongoose";

export interface IGoal {
  calories: number;
  carbs: number;
  fats: number;
  proteins: number;
  userId: string;
}

const GoalSchema = new Schema<IGoal>(
  {
    calories: {
      type: Number,
      required: [true, "Meta de calorias é obrigatória"],
      min: [0, "Meta de calorias deve ser um número positivo"],
      default: 2000,
    },
    carbs: {
      type: Number,
      required: [true, "Meta de carboidratos é obrigatória"],
      min: [0, "Meta de carboidratos deve ser um número positivo"],
      default: 250,
    },
    fats: {
      type: Number,
      required: [true, "Meta de gorduras é obrigatória"],
      min: [0, "Meta de gorduras deve ser um número positivo"],
      default: 65,
    },
    proteins: {
      type: Number,
      required: [true, "Meta de proteínas é obrigatória"],
      min: [0, "Meta de proteínas deve ser um número positivo"],
      default: 150,
    },
    userId: {
      type: String,
      required: [true, "ID do usuário é obrigatório"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Verificar se o modelo já existe para evitar erros de redefinição de modelo
const Goal = mongoose.models?.Goal || mongoose.model<IGoal>("Goal", GoalSchema);

export default Goal;
