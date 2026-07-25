import { Link } from 'react-router-dom';
import { 
  Storefront, 
  Package, 
  Users, 
  ClipboardText, 
  WhatsAppLogo, 
  Sparkle, 
  ChartBar, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle 
} from 'phosphor-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-fundo font-corpo animate-fade-in-up">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-titulo text-2xl text-primaria">Aromaê</h1>
          <div className="flex gap-3">
            <Link to="/login" className="text-texto/70 hover:text-primaria font-semibold text-sm px-3 py-2">Entrar</Link>
            <Link to="/cadastro" className="bg-primaria text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-primaria/90 transition">Começar gratis</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
        <div className="inline-block bg-primaria/10 text-primaria px-4 py-1 rounded-full text-sm font-semibold mb-6">
          ⚡ Lançamento: 7 dias grátis
        </div>
        <h2 className="font-titulo text-4xl md:text-6xl text-texto leading-tight mb-4">
          Sua vitrine de perfumes <br />
          <span className="text-primaria">organizada e profissional</span>
        </h2>
        <p className="text-texto/70 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Crie um catálogo lindo, controle estoque, pedidos e clientes, e compartilhe sua loja no WhatsApp e Instagram em minutos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/cadastro" className="bg-primaria text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primaria/90 transition flex items-center justify-center gap-2">
            Começar agora <ArrowRight size={20} />
          </Link>
          <a href="#planos" className="border-2 border-primaria text-primaria px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primaria/10 transition">
            Ver planos
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <h3 className="font-titulo text-3xl text-center text-primaria mb-12">Tudo que você precisa para vender mais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-primaria/10 flex items-center justify-center mb-4">
              <Package size={24} className="text-primaria" />
            </div>
            <h4 className="font-bold text-lg">Catálogo digital</h4>
            <p className="text-texto/70 text-sm">Adicione fotos, preços e descrições. Sua vitrine fica pronta em minutos.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-secundaria/10 flex items-center justify-center mb-4">
              <ChartBar size={24} className="text-secundaria" />
            </div>
            <h4 className="font-bold text-lg">Dashboard inteligente</h4>
            <p className="text-texto/70 text-sm">Acompanhe vendas, estoque baixo e pedidos pendentes em um só lugar.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <WhatsAppLogo size={24} className="text-green-500" />
            </div>
            <h4 className="font-bold text-lg">WhatsApp integrado</h4>
            <p className="text-texto/70 text-sm">Clientes pedem direto pelo WhatsApp com um clique. Você negocia sem sair do app.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <Users size={24} className="text-blue-500" />
            </div>
            <h4 className="font-bold text-lg">Gestão de clientes</h4>
            <p className="text-texto/70 text-sm">Cadastre e organize sua base de clientes com telefone e cidade.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
              <ClipboardText size={24} className="text-orange-500" />
            </div>
            <h4 className="font-bold text-lg">Pedidos completos</h4>
            <p className="text-texto/70 text-sm">Registre pedidos, escolha cliente e produtos, e o estoque baixa automaticamente.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-primaria/10 flex items-center justify-center mb-4">
              <Storefront size={24} className="text-primaria" />
            </div>
            <h4 className="font-bold text-lg">Vitrine pública</h4>
            <p className="text-texto/70 text-sm">Compartilhe o link da sua loja. Qualquer pessoa pode ver seu catálogo e pedir.</p>
          </div>
        </div>
      </section>

      {/* Testimonials (Prova Social) */}
      <section className="bg-white/50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="font-titulo text-3xl text-primaria mb-8">Quem já está usando</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm text-left">
              <p className="text-sm text-texto/70 italic">"Meu catálogo ficou profissional e minhas clientes adoram. O estoque baixo automático me salvou!"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primaria/20 flex items-center justify-center text-primaria font-bold">J</div>
                <div><p className="font-semibold">Joana</p><p className="text-xs text-texto/50">Revendedora Avon</p></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-left">
              <p className="text-sm text-texto/70 italic">"A integração com WhatsApp é sensacional. Meus pedidos aumentaram 40% em 2 semanas."</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secundaria/20 flex items-center justify-center text-secundaria font-bold">M</div>
                <div><p className="font-semibold">Marcela</p><p className="text-xs text-texto/50">Revendedora Natura</p></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-left">
              <p className="text-sm text-texto/70 italic">"Super fácil de usar, e meus clientes elogiam a vitrine. Recomendo para todas!"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primaria/20 flex items-center justify-center text-primaria font-bold">C</div>
                <div><p className="font-semibold">Camila</p><p className="text-xs text-texto/50">Revendedora Jequiti</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <h3 className="font-titulo text-3xl text-center text-primaria mb-4">Escolha o plano ideal</h3>
        <p className="text-center text-texto/70 mb-12">Teste grátis por 7 dias. Sem compromisso.</p>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {/* Mensal */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-gray-100 flex-1 max-w-sm">
            <h4 className="font-titulo text-2xl text-texto">Mensal</h4>
            <p className="text-3xl font-bold text-primaria mt-4">R$ 19,90</p>
            <p className="text-sm text-texto/50">por mês</p>
            <ul className="mt-6 space-y-2 text-sm text-texto/70">
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sucesso" /> Vitrine ilimitada</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sucesso" /> Gestão de estoque</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sucesso" /> Pedidos e clientes</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sucesso" /> Suporte via WhatsApp</li>
            </ul>
            <Link to="/cadastro" className="mt-6 block w-full bg-primaria text-white py-3 rounded-lg font-semibold text-center hover:bg-primaria/90 transition">
              Assinar mensal
            </Link>
          </div>
          {/* Anual (Destaque) */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-primaria relative flex-1 max-w-sm transform md:scale-105">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secundaria text-white px-4 py-1 rounded-full text-xs font-bold">Mais econômico</span>
            <h4 className="font-titulo text-2xl text-texto">Anual</h4>
            <p className="text-3xl font-bold text-primaria mt-4">R$ 199,00</p>
            <p className="text-sm text-texto/50">por ano (economize R$ 40)</p>
            <ul className="mt-6 space-y-2 text-sm text-texto/70">
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sucesso" /> Todos os benefícios</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sucesso" /> 2 meses grátis</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sucesso" /> Prioridade no suporte</li>
              <li className="flex items-center gap-2"><Sparkle size={16} className="text-secundaria" /> Acesso a novidades</li>
            </ul>
            <Link to="/cadastro" className="mt-6 block w-full bg-primaria text-white py-3 rounded-lg font-semibold text-center hover:bg-primaria/90 transition">
              Assinar anual
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white/50 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="font-titulo text-3xl text-center text-primaria mb-8">Perguntas frequentes</h3>
          <div className="space-y-4">
            <details className="bg-white p-4 rounded-lg shadow-sm">
              <summary className="font-semibold cursor-pointer">Preciso de um site separado?</summary>
              <p className="mt-2 text-sm text-texto/70">Não! O Aromaê cria sua vitrine automaticamente. Você só compartilha o link.</p>
            </details>
            <details className="bg-white p-4 rounded-lg shadow-sm">
              <summary className="font-semibold cursor-pointer">Como funciona o período de teste?</summary>
              <p className="mt-2 text-sm text-texto/70">Você tem 7 dias grátis para testar todos os recursos. Depois, escolhe um plano para continuar.</p>
            </details>
            <details className="bg-white p-4 rounded-lg shadow-sm">
              <summary className="font-semibold cursor-pointer">Posso cancelar quando quiser?</summary>
              <p className="mt-2 text-sm text-texto/70">Sim! Você pode cancelar a qualquer momento. Não há fidelidade.</p>
            </details>
            <details className="bg-white p-4 rounded-lg shadow-sm">
              <summary className="font-semibold cursor-pointer">O sistema funciona no celular?</summary>
              <p className="mt-2 text-sm text-texto/70">Sim! O Aromaê é 100% responsivo e pode ser usado pelo navegador do celular.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-texto/60">
          <p>&copy; {new Date().getFullYear()} Aromaê. Todos os direitos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primaria">Termos</a>
            <a href="#" className="hover:text-primaria">Privacidade</a>
            <a href="https://wa.me/5513996984764" target="_blank" className="hover:text-primaria">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
