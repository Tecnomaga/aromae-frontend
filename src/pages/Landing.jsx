import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Storefront, 
  Package, 
  Users, 
  ClipboardText, 
  WhatsappLogo, 
  Sparkle, 
  ChartBar, 
  ArrowRight, 
  CheckCircle,
  ShieldCheck
} from 'phosphor-react';

// Variantes de animação (para reutilizar)
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 15 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const scaleOnHover = {
  hover: { scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 10 } }
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-fundo font-corpo overflow-x-hidden relative">
      
      {/* Fundo de Blur decorativo (efeito 3D sutil) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primaria/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-secundaria/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header com Glassmorphism */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5, type: 'spring' }}
            className="font-titulo text-2xl text-primaria"
          >
            Aromaê
          </motion.h1>
          <div className="flex gap-3">
            <Link to="/login" className="text-texto/70 hover:text-primaria font-semibold text-sm px-3 py-2 transition-colors">Entrar</Link>
            <Link to="/cadastro" className="bg-primaria text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-primaria/90 active:scale-95 transition-all shadow-md">Começar grátis</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        initial="hidden" 
        animate="visible" 
        variants={fadeInUp}
        className="max-w-7xl mx-auto px-4 py-28 md:py-40 text-center relative"
      >
        <motion.div 
          className="inline-block bg-primaria/10 text-primaria px-4 py-1 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          ⚡ Lançamento: 3 dias grátis
        </motion.div>
        
        <motion.h2 
          className="font-titulo text-5xl md:text-7xl text-texto leading-tight mb-6 text-balance"
          variants={fadeInUp}
        >
          Sua vitrine de perfumes <br />
          <span className="text-primaria relative inline-block">
            organizada e profissional
            <motion.div 
              className="absolute bottom-1 left-0 w-full h-2 bg-primaria/20 -z-10 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 0.6 }}
            />
          </span>
        </motion.h2>
        
        <motion.p 
          className="text-texto/70 text-xl md:text-2xl max-w-3xl mx-auto mb-10 font-corpo font-light"
          variants={fadeInUp}
        >
          Crie um catálogo lindo, controle estoque, pedidos e clientes, e compartilhe sua loja no WhatsApp e Instagram em minutos.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={fadeInUp}
        >
          <Link to="/cadastro" className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl">
            Começar agora <ArrowRight size={20} weight="bold" />
          </Link>
          <a href="#planos" className="btn-secondary flex items-center justify-center gap-2 text-lg px-8 py-3 rounded-xl">
            Ver planos
          </a>
        </motion.div>
      </motion.section>

      {/* Benefits Section com Stagger */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 py-20 md:py-28"
      >
        <motion.h3 variants={fadeInUp} className="font-titulo text-4xl text-center text-primaria mb-16">
          Tudo que você precisa para vender mais
        </motion.h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Package, title: 'Catálogo digital', desc: 'Adicione fotos, preços e descrições. Sua vitrine fica pronta em minutos.', color: 'text-primaria' },
            { icon: ChartBar, title: 'Dashboard inteligente', desc: 'Acompanhe vendas, estoque baixo e pedidos pendentes em um só lugar.', color: 'text-secundaria' },
            { icon: WhatsappLogo, title: 'WhatsApp integrado', desc: 'Clientes pedem direto pelo WhatsApp com um clique. Você negocia sem sair do app.', color: 'text-green-500' },
            { icon: Users, title: 'Gestão de clientes', desc: 'Cadastre e organize sua base de clientes com telefone e cidade.', color: 'text-blue-500' },
            { icon: ClipboardText, title: 'Pedidos completos', desc: 'Registre pedidos, escolha cliente e produtos, e o estoque baixa automaticamente.', color: 'text-orange-500' },
            { icon: Storefront, title: 'Vitrine pública', desc: 'Compartilhe o link da sua loja. Qualquer pessoa pode ver seu catálogo e pedir.', color: 'text-primaria' }
          ].map((item, index) => (
            <motion.div 
              key={index} 
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { type: 'spring', stiffness: 200 } }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-white/40"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${item.color}/20 to-${item.color}/5 flex items-center justify-center mb-5`}>
                <item.icon size={28} className={item.color} weight="duotone" />
              </div>
              <h4 className="font-bold text-xl mb-2">{item.title}</h4>
              <p className="text-texto/60 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-white/50 to-transparent py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="font-titulo text-4xl text-primaria mb-12"
          >
            Quem já está usando
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: '"Meu catálogo ficou profissional e minhas clientes adoram. O estoque baixo automático me salvou!"', name: 'Joana', role: 'Revendedora Avon' },
              { quote: '"A integração com WhatsApp é sensacional. Meus pedidos aumentaram 40% em 2 semanas."', name: 'Marcela', role: 'Revendedora Natura' },
              { quote: '"Super fácil de usar, e meus clientes elogiam a vitrine. Recomendo para todas!"', name: 'Camila', role: 'Revendedora Jequiti' }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }} 
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <p className="text-texto/70 italic text-lg leading-relaxed mb-6">"{item.quote}"</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primaria to-secundaria text-white flex items-center justify-center font-bold text-lg">
                    {item.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-xs text-texto/50">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <motion.section 
        id="planos" 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 py-20 md:py-28"
      >
        <motion.h3 initial={{ y: 20 }} whileInView={{ y: 0 }} className="font-titulo text-4xl text-center text-primaria mb-4">Escolha o plano ideal</motion.h3>
        <motion.p initial={{ y: 20 }} whileInView={{ y: 0 }} className="text-center text-texto/70 mb-14">Teste grátis por 3 dias. Sem compromisso.</motion.p>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          
          {/* Mensal */}
          <motion.div 
            whileHover="hover"
            variants={scaleOnHover}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex-1 max-w-sm"
          >
            <h4 className="font-titulo text-2xl text-texto">Mensal</h4>
            <p className="text-4xl font-bold text-primaria mt-4">R$ 19,90</p>
            <p className="text-sm text-texto/50">por mês</p>
            <ul className="mt-8 space-y-3 text-sm text-texto/70">
              <li className="flex items-center gap-3"><CheckCircle size={20} className="text-sucesso" weight="fill" /> Vitrine ilimitada</li>
              <li className="flex items-center gap-3"><CheckCircle size={20} className="text-sucesso" weight="fill" /> Gestão de estoque</li>
              <li className="flex items-center gap-3"><CheckCircle size={20} className="text-sucesso" weight="fill" /> Pedidos e clientes</li>
              <li className="flex items-center gap-3"><CheckCircle size={20} className="text-sucesso" weight="fill" /> Suporte via WhatsApp</li>
            </ul>
            <Link to="/cadastro" className="mt-8 block w-full bg-primaria text-white py-3 rounded-xl font-semibold text-center hover:bg-primaria/90 active:scale-95 transition-all shadow-md">
              Assinar mensal
            </Link>
          </motion.div>

          {/* Anual (Destaque) */}
          <motion.div 
            whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 200 } }}
            className="bg-white p-8 rounded-3xl shadow-xl border-2 border-primaria relative flex-1 max-w-sm"
          >
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secundaria text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">Mais econômico</span>
            <h4 className="font-titulo text-2xl text-texto">Anual</h4>
            <p className="text-4xl font-bold text-primaria mt-4">R$ 199,00</p>
            <p className="text-sm text-texto/50">por ano (economize R$ 40)</p>
            <ul className="mt-8 space-y-3 text-sm text-texto/70">
              <li className="flex items-center gap-3"><CheckCircle size={20} className="text-sucesso" weight="fill" /> Todos os benefícios</li>
              <li className="flex items-center gap-3"><CheckCircle size={20} className="text-sucesso" weight="fill" /> 2 meses grátis</li>
              <li className="flex items-center gap-3"><CheckCircle size={20} className="text-sucesso" weight="fill" /> Prioridade no suporte</li>
              <li className="flex items-center gap-3"><Sparkle size={20} className="text-secundaria" weight="fill" /> Acesso a novidades</li>
            </ul>
            <Link to="/cadastro" className="mt-8 block w-full bg-primaria text-white py-3 rounded-xl font-semibold text-center hover:bg-primaria/90 active:scale-95 transition-all shadow-lg">
              Assinar anual
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ */}
      <section className="bg-gradient-to-b from-transparent to-white/50 py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4">
          <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="font-titulo text-4xl text-center text-primaria mb-10">Perguntas frequentes</motion.h3>
          <div className="space-y-4">
            {[
              'Preciso de um site separado?',
              'Como funciona o período de teste?',
              'Posso cancelar quando quiser?',
              'O sistema funciona no celular?'
            ].map((q, i) => (
              <motion.details 
                key={i}
                initial={{ opacity: 0, y: 10 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <summary className="font-semibold hover:text-primaria transition-colors flex justify-between items-center">
                  {q}
                  <span className="text-primaria/50 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-3 text-sm text-texto/70 leading-relaxed"
                >
                  {i === 0 && 'Não! O Aromaê cria sua vitrine automaticamente. Você só compartilha o link.'}
                  {i === 1 && 'Você tem 3 dias grátis para testar todos os recursos. Depois, escolhe um plano para continuar.'}
                  {i === 2 && 'Sim! Você pode cancelar a qualquer momento. Não há fidelidade.'}
                  {i === 3 && 'Sim! O Aromaê é 100% responsivo e pode ser usado pelo navegador do celular.'}
                </motion.div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-100/80 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-texto/60 gap-4">
          <p>&copy; {new Date().getFullYear()} Aromaê. Todos os direitos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primaria transition-colors">Termos</a>
            <a href="#" className="hover:text-primaria transition-colors">Privacidade</a>
            <a href="https://wa.me/5513996984764" target="_blank" className="hover:text-primaria transition-colors flex items-center gap-1">
              <WhatsappLogo size={16} weight="fill" /> Suporte
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
                  }
