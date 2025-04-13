import Link from "next/link";


export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">MealTracker</h1>
          </div>
          <div>
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-primary-600 rounded-md hover:bg-primary-700 transition"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Controle sua alimentação com o MealTracker
            </h2>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
              Registre suas refeições, acompanhe calorias e mantenha-se saudável
              com nosso app simples e eficiente.
            </p>
            <Link
              href="/auth/signin"
              className="px-6 py-3 bg-white text-primary-600 text-black rounded-md text-lg font-medium hover:bg-gray-100 transition"
            >
              Comece agora - É grátis!
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Recursos principais
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-primary-500 text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">
                  Registro completo
                </h3>
                <p className="text-gray-600">
                  Registre o nome, descrição, calorias, data/hora e tipo das
                  suas refeições diárias.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-primary-500 text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">
                  Estatísticas em tempo real
                </h3>
                <p className="text-gray-600">
                  Acompanhe o total de calorias diárias e visualize estatísticas
                  por tipo de refeição.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-primary-500 text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">
                  Filtragem inteligente
                </h3>
                <p className="text-gray-600">
                  Filtre suas refeições por tipo: café da manhã, almoço, lanche
                  da tarde ou janta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">
              Pronto para controlar sua alimentação?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Registre-se agora e comece a acompanhar suas refeições diárias de
              forma simples e eficiente.
            </p>
            <Link
              href="/auth/signin"
              className="px-6 py-3 bg-white text-black rounded-md text-lg font-medium hover:bg-gray-100 transition"
            >
              Começar agora
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} MealTracker. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
