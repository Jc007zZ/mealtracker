import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { MealModalProvider } from "@/contexts/MealModalContext";
import ProtectedLayoutClient from "@/components/ProtectedLayoutClient";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MealModalProvider>
        <ProtectedLayoutClient>{children}</ProtectedLayoutClient>
      </MealModalProvider>
    </div>
  );
}
