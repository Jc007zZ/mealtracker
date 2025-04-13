"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

type NavItem = {
  name: string;
  href?: string;
  action?: () => void;
  isButton?: boolean;
};

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Metas Diárias", href: "/goals" },
    { name: "Refeições", href: "/meals" },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo e navegação desktop */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/dashboard"
                className="text-xl font-bold text-primary-600"
              >
                MealTracker
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item, index) =>
                item.isButton ? (
                  <button
                    key={index}
                    onClick={item.action}
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href || "#"}
                    className={`${
                      pathname === item.href
                        ? "border-primary-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Menu do usuário */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session?.user ? (
              <div className="ml-3 relative">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">
                    {session.user.name}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition"
              >
                Entrar
              </Link>
            )}
          </div>

          {/* Botão mobile */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu principal</span>
              {/* Ícone do menu */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Ícone de fechar */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item, index) =>
            item.isButton ? (
              <button
                key={index}
                onClick={() => {
                  toggleMenu();
                  item.action?.();
                }}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 text-base font-medium w-full text-left"
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href || "#"}
                className={`${
                  pathname === item.href
                    ? "bg-primary-50 border-primary-500 text-primary-700"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            )
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {session?.user ? (
            <>
              <div className="flex items-center px-4">
                {session.user.image && (
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={session.user.image}
                      alt={session.user.name || "Avatar do usuário"}
                    />
                  </div>
                )}
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {session.user.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {session.user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={() => {
                    toggleMenu();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left"
                >
                  Sair
                </button>
              </div>
            </>
          ) : (
            <div className="px-4">
              <Link
                href="/auth/signin"
                className="block text-center px-4 py-2 text-base font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                onClick={toggleMenu}
              >
                Entrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
