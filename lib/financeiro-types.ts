// ── Tipos ──
export interface Transaction {
  id: number;
  date: string;
  desc: string;
  valor: string;
  tipo: "entrada" | "saida";
  categoria: string;
  subcategoria: string;
  /** Se true, a transação aparece em todos os meses a partir do mês original */
  recorrente?: boolean;
}

// ── Constantes ──
export const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export const CURRENT_YEAR = 26;

export const CATEGORIAS_ENTRADA = [
  "Freelance",
  "Salario",
  "Venda de Projeto",
  "Consultoria",
  "Investimentos",
  "Outros",
];

export const CATEGORIAS_SAIDA = [
  "Alimentacao",
  "Transporte",
  "Moradia",
  "Assinaturas",
  "Material de Trabalho",
  "Internet e Telefone",
  "Impostos",
  "Outros",
];

export const SUBCATEGORIAS_SAIDA: Record<string, string[]> = {
  Alimentacao: ["Mercado", "Restaurante", "Delivery", "Café"],
  Transporte: [
    "Combustível",
    "Uber/99",
    "Transporte Público",
    "Manutenção Veículo",
  ],
  Moradia: ["Aluguel", "Condomínio", "Coworking", "Manutenção"],
  Assinaturas: ["Software", "Streaming", "Domínio e Hospedagem", "Cloud"],
  "Material de Trabalho": ["Escritório", "Equipamento", "Papelaria"],
  "Internet e Telefone": ["Internet Fixa", "Celular", "Plano de Dados"],
  Impostos: ["ISS", "IR", "MEI", "Outros Impostos"],
  Outros: ["Diversos"],
};

export const SUBCATEGORIAS_ENTRADA: Record<string, string[]> = {
  Freelance: ["Design", "Desenvolvimento", "Ilustração", "Outros"],
  Salario: ["CLT", "PJ"],
  "Venda de Projeto": ["Web", "App", "Consultoria", "Branding"],
  Consultoria: ["Técnica", "Estratégia", "UX/UI"],
  Investimentos: ["Dividendos", "Rendimentos", "Venda de Ativos"],
  Outros: ["Diversos"],
};

// ── Dados iniciais ──
export const initialTransactions: Transaction[] = [
  {
    id: 101,
    date: "28/01/2026",
    desc: "Pagamento Projeto X",
    valor: "+R$ 3.800,00",
    tipo: "entrada",
    categoria: "Venda de Projeto",
    subcategoria: "Projeto Web",
  },
  {
    id: 102,
    date: "20/01/2026",
    desc: "Aluguel Coworking",
    valor: "-R$ 450,00",
    tipo: "saida",
    categoria: "Moradia",
    subcategoria: "Coworking",
  },
  {
    id: 103,
    date: "15/01/2026",
    desc: "Freelance Design",
    valor: "+R$ 1.200,00",
    tipo: "entrada",
    categoria: "Freelance",
    subcategoria: "Design",
  },
  {
    id: 104,
    date: "10/01/2026",
    desc: "Domínio e Hospedagem",
    valor: "-R$ 89,90",
    tipo: "saida",
    categoria: "Assinaturas",
    subcategoria: "Hospedagem",
  },
  {
    id: 1,
    date: "15/02/2026",
    desc: "Pagamento Freelance",
    valor: "+R$ 2.500,00",
    tipo: "entrada",
    categoria: "Freelance",
    subcategoria: "Desenvolvimento",
  },
  {
    id: 2,
    date: "14/02/2026",
    desc: "Conta de Internet",
    valor: "-R$ 120,00",
    tipo: "saida",
    categoria: "Internet e Telefone",
    subcategoria: "Internet Fibra",
  },
  {
    id: 3,
    date: "12/02/2026",
    desc: "Venda de Projeto",
    valor: "+R$ 4.200,00",
    tipo: "entrada",
    categoria: "Venda de Projeto",
    subcategoria: "Projeto Web",
  },
  {
    id: 4,
    date: "10/02/2026",
    desc: "Assinatura Software",
    valor: "-R$ 49,90",
    tipo: "saida",
    categoria: "Assinaturas",
    subcategoria: "SaaS / Ferramentas",
  },
  {
    id: 5,
    date: "08/02/2026",
    desc: "Consultoria",
    valor: "+R$ 800,00",
    tipo: "entrada",
    categoria: "Consultoria",
    subcategoria: "Consultoria Técnica",
  },
  {
    id: 6,
    date: "05/02/2026",
    desc: "Material de Escritorio",
    valor: "-R$ 65,00",
    tipo: "saida",
    categoria: "Material de Trabalho",
    subcategoria: "Papelaria",
  },
];

// ── Utilitários ──
export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseCurrency(valor: string): number {
  const cleaned = valor.replace(/[^\d,.-]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}
