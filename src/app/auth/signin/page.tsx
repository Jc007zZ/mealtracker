"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
   const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("google", {
        callbackUrl,
        redirect: false,
      });
      if (result?.error) {
        setError("Ocorreu um erro na autenticação.");
      }

      if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      setError("Falha na autenticação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            MealTracker
          </Link>
          <h2 className="text-2xl font-bold mt-6 mb-2">Entrar na sua conta</h2>
          <p className="text-gray-600">
            Controle suas refeições e mantenha uma alimentação saudável
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md p-3 text-gray-700 hover:bg-gray-50 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
              width="20"
              height="20"
            >
              <path
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                fill="#4285F4"
              />
            </svg>
            {isLoading ? "Processando..." : "Continuar com Google"}
          </button>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          Ao entrar, você concorda com os nossos{" "}
          <a href="#" className="text-primary-600 hover:underline">
            Termos de serviço
          </a>{" "}
          e{" "}
          <a href="#" className="text-primary-600 hover:underline">
            Política de privacidade
          </a>
        </div>
      </div>
    </div>
  );
}
