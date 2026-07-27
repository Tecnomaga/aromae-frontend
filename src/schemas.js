import { z } from 'zod';

// Schema de Login
export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

// Schema de Cadastro (com confirmação de senha)
export const cadastroSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  senhaConfirmacao: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
}).refine((data) => data.senha === data.senhaConfirmacao, {
  message: "As senhas não coincidem",
  path: ["senhaConfirmacao"], // Aponta o erro para o campo de confirmação
});

// Schema de Cliente
export const clienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  telefone: z.string().min(10, 'Telefone inválido (mínimo 10 dígitos)'),
  cidade: z.string().optional()
});

// Schema de Pedido
export const pedidoSchema = z.object({
  cliente: z.string().min(1, 'Cliente é obrigatório'),
  itens: z.array(
    z.object({
      produto: z.string().min(1, 'Selecione um produto'),
      quantidade: z.number().min(1, 'Quantidade mínima 1'),
      precoUnitario: z.number().min(0)
    })
  ).min(1, 'Adicione pelo menos um item'),
  status: z.string()
});

// Schema de Produto
export const produtoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  marca: z.string().min(1, 'Marca é obrigatória'),
  preco: z.number().min(0.01, 'Preço deve ser maior que zero'),
  estoque: z.number().min(0, 'Estoque não pode ser negativo'),
  descricao: z.string().optional(),
  ativo: z.boolean()
});

// Schema de Onboarding
export const onboardingSchema = z.object({
  nomeLoja: z.string().min(3, 'Nome da loja deve ter pelo menos 3 caracteres'),
  slug: z.string().min(3, 'Link deve ter pelo menos 3 caracteres'),
  telefone: z.string().min(10, 'Telefone inválido (mínimo 10 dígitos)')
});
