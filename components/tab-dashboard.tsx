"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useSoundContext } from "./sound-provider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Transaction {
  id: number;
  date: string;
  desc: string;
  valor: string;
  tipo: "entrada" | "saida";
  categoria: string;
  subcategoria: string;
}

const MONTH_LABELS = [
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

const PIE_COLORS = [
  "#7b2d8e",
  "#4a6fa5",
  "#e8a4c8",
  "#c4a035",
  "#d4467a",
  "#6a9a6a",
  "#5a1d6e",
  "#2d4a7b",
  "#9b4dae",
  "#b85c3a",
];

// ── Mapa de Categorias → Subcategorias ──
const CATEGORIAS_SAIDA: Record<string, string[]> = {
  Moradia: ["Aluguel", "Condomínio", "Coworking", "Manutenção"],
  Assinaturas: ["Software", "Streaming", "Domínio e Hospedagem", "Cloud"],
  "Internet e Telefone": ["Internet Fixa", "Celular", "Plano de Dados"],
  "Material de Trabalho": ["Escritório", "Equipamento", "Papelaria"],
  Alimentação: ["Mercado", "Restaurante", "Delivery", "Café"],
  Transporte: [
    "Combustível",
    "Uber/99",
    "Transporte Público",
    "Manutenção Veículo",
  ],
  Impostos: ["ISS", "IR", "MEI", "Outros Impostos"],
  Outros: ["Diversos"],
};

const CATEGORIAS_ENTRADA: Record<string, string[]> = {
  Freelance: ["Design", "Desenvolvimento", "Ilustração", "Outros"],
  "Venda de Projeto": ["Web", "App", "Consultoria", "Branding"],
  Consultoria: ["Técnica", "Estratégia", "UX/UI"],
  Salário: ["CLT", "PJ"],
  Investimentos: ["Dividendos", "Rendimentos", "Venda de Ativos"],
  Outros: ["Diversos"],
};

// Dados com subcategorias
const transactions: Transaction[] = [
  {
    id: 101,
    date: "28/01/2026",
    desc: "Pagamento Projeto X",
    valor: "+R$ 3.800,00",
    tipo: "entrada",
    categoria: "Venda de Projeto",
    subcategoria: "Web",
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
    subcategoria: "Domínio e Hospedagem",
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
    subcategoria: "Internet Fixa",
  },
  {
    id: 3,
    date: "12/02/2026",
    desc: "Venda de Projeto",
    valor: "+R$ 4.200,00",
    tipo: "entrada",
    categoria: "Venda de Projeto",
    subcategoria: "App",
  },
  {
    id: 4,
    date: "10/02/2026",
    desc: "Assinatura Software",
    valor: "-R$ 49,90",
    tipo: "saida",
    categoria: "Assinaturas",
    subcategoria: "Software",
  },
  {
    id: 5,
    date: "08/02/2026",
    desc: "Consultoria",
    valor: "+R$ 800,00",
    tipo: "entrada",
    categoria: "Consultoria",
    subcategoria: "UX/UI",
  },
  {
    id: 6,
    date: "05/02/2026",
    desc: "Material de Escritorio",
    valor: "-R$ 65,00",
    tipo: "saida",
    categoria: "Material de Trabalho",
    subcategoria: "Escritório",
  },
  {
    id: 7,
    date: "03/02/2026",
    desc: "Café da manhã equipe",
    valor: "-R$ 42,00",
    tipo: "saida",
    categoria: "Alimentação",
    subcategoria: "Café",
  },
  {
    id: 8,
    date: "01/02/2026",
    desc: "Uber para reunião",
    valor: "-R$ 28,50",
    tipo: "saida",
    categoria: "Transporte",
    subcategoria: "Uber/99",
  },
];

function parseCurrency(valor: string): number {
  const cleaned = valor.replace(/[^\d,.-]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Tooltip retrô para barras
function RetroTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="border-2 border-[#7b2d8e] bg-[#fff0fc] px-3 py-2 text-sm"
      style={{ boxShadow: "2px 2px 0 #2a0a3b" }}
    >
      {label && <div className="mb-1 text-[#3d1a5c]">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}: R$ {formatCurrency(p.value)}
        </div>
      ))}
    </div>
  );
}

// Tooltip retrô para pizza
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RetroPieTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const pct =
    item.payload.customPercent ??
    (item.payload.percent != null
      ? item.payload.percent
      : (item.percent ?? 0)) * 100;
  return (
    <div
      className="border-2 border-[#7b2d8e] bg-[#fff0fc] px-3 py-2 text-sm"
      style={{ boxShadow: "2px 2px 0 #2a0a3b" }}
    >
      <div className="mb-1 font-bold" style={{ color: item.payload.fill }}>
        {item.name}
      </div>
      <div className="text-[#3d1a5c]">R$ {formatCurrency(item.value)}</div>
      <div className="text-[#3d1a5c]">
        {typeof pct === "number" ? pct.toFixed(1) : pct}%
      </div>
    </div>
  );
}

// ── Dropdown retrô reutilizável ──
function RetroDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { playClick } = useSoundContext();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="mb-0.5 text-xs text-[#3d1a5c]">{label}</div>
      <button
        type="button"
        onClick={() => {
          playClick();
          setOpen(!open);
        }}
        className="flex w-full items-center justify-between border-2 border-[#7b2d8e] bg-[#fff0fc] px-2 py-1 text-left text-sm text-[#1a0a2e]"
        style={{
          boxShadow: "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
        }}
      >
        <span className="truncate">{value || "Todas"}</span>
        <span className="ml-1 text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div
          className="absolute left-0 right-0 top-full z-50 max-h-40 overflow-y-auto border-2 border-[#7b2d8e] bg-[#fff0fc]"
          style={{ boxShadow: "2px 2px 0 #2a0a3b" }}
        >
          <button
            type="button"
            onClick={() => {
              playClick();
              onChange("");
              setOpen(false);
            }}
            className={`block w-full px-2 py-1 text-left text-sm hover:bg-[#e8d0f0] ${!value ? "bg-[#d4b8e8] font-bold text-[#3d1a5c]" : "text-[#1a0a2e]"}`}
          >
            Todas
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                playClick();
                onChange(opt);
                setOpen(false);
              }}
              className={`block w-full px-2 py-1 text-left text-sm hover:bg-[#e8d0f0] ${value === opt ? "bg-[#d4b8e8] font-bold text-[#3d1a5c]" : "text-[#1a0a2e]"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TabDashboard() {
  // ── Filtros ──
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterSubcategoria, setFilterSubcategoria] = useState("");
  const { playClick } = useSoundContext();

  // Opções de categoria (apenas saídas, que é o foco dos gastos)
  const allCategorias = useMemo(() => Object.keys(CATEGORIAS_SAIDA), []);

  // Opções de subcategoria baseadas na categoria selecionada
  const subcategoriaOptions = useMemo(() => {
    if (!filterCategoria) {
      // Todas as subcategorias de todas as categorias de saída
      return Object.values(CATEGORIAS_SAIDA).flat();
    }
    return CATEGORIAS_SAIDA[filterCategoria] || [];
  }, [filterCategoria]);

  // Reset subcategoria quando categoria muda
  const handleCategoriaChange = (cat: string) => {
    setFilterCategoria(cat);
    setFilterSubcategoria("");
  };

  // Transações de saída filtradas
  const filteredSaidas = useMemo(() => {
    return transactions.filter((t) => {
      if (t.tipo !== "saida") return false;
      if (filterCategoria && t.categoria !== filterCategoria) return false;
      if (filterSubcategoria && t.subcategoria !== filterSubcategoria)
        return false;
      return true;
    });
  }, [filterCategoria, filterSubcategoria]);

  // ── Dados mensais (Entradas vs Saídas por mês) ──
  const monthlyData = useMemo(() => {
    const map: Record<number, { entradas: number; saidas: number }> = {};
    for (const t of transactions) {
      // Saídas respeitam filtro, entradas sempre aparecem
      if (t.tipo === "saida") {
        if (filterCategoria && t.categoria !== filterCategoria) continue;
        if (filterSubcategoria && t.subcategoria !== filterSubcategoria)
          continue;
      }
      const month = parseInt(t.date.split("/")[1], 10) - 1;
      if (!map[month]) map[month] = { entradas: 0, saidas: 0 };
      const val = Math.abs(parseCurrency(t.valor));
      if (t.tipo === "entrada") map[month].entradas += val;
      else map[month].saidas += val;
    }
    return Object.entries(map)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([m, v]) => ({
        mes: MONTH_LABELS[Number(m)],
        Entradas: v.entradas,
        Saidas: v.saidas,
        Poupado: v.entradas - v.saidas,
      }));
  }, [filterCategoria, filterSubcategoria]);

  // ── Gastos por categoria (% sobre saídas) ──
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    let totalSaidas = 0;
    for (const t of filteredSaidas) {
      const val = Math.abs(parseCurrency(t.valor));
      map[t.categoria] = (map[t.categoria] || 0) + val;
      totalSaidas += val;
    }
    return Object.entries(map)
      .map(([name, value]) => ({
        name,
        value,
        customPercent: totalSaidas > 0 ? (value / totalSaidas) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredSaidas]);

  // ── Gastos por subcategoria (% sobre saídas) ──
  const subcategoryData = useMemo(() => {
    const map: Record<string, number> = {};
    let totalSaidas = 0;
    for (const t of filteredSaidas) {
      const val = Math.abs(parseCurrency(t.valor));
      const key = t.subcategoria;
      map[key] = (map[key] || 0) + val;
      totalSaidas += val;
    }
    return Object.entries(map)
      .map(([name, value]) => ({
        name,
        value,
        customPercent: totalSaidas > 0 ? (value / totalSaidas) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredSaidas]);

  // ── Gastos por categoria como % das entradas ──
  const categoryVsEntradasData = useMemo(() => {
    const map: Record<string, number> = {};
    let totalEntradas = 0;
    for (const t of transactions) {
      const val = Math.abs(parseCurrency(t.valor));
      if (t.tipo === "entrada") {
        totalEntradas += val;
      }
    }
    for (const t of filteredSaidas) {
      const val = Math.abs(parseCurrency(t.valor));
      map[t.categoria] = (map[t.categoria] || 0) + val;
    }
    return Object.entries(map)
      .map(([name, value]) => ({
        name,
        value,
        customPercent: totalEntradas > 0 ? (value / totalEntradas) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredSaidas]);

  // ── Totais gerais ──
  const totals = useMemo(() => {
    let entradas = 0;
    for (const t of transactions) {
      if (t.tipo === "entrada") entradas += Math.abs(parseCurrency(t.valor));
    }
    let saidas = 0;
    for (const t of filteredSaidas) {
      saidas += Math.abs(parseCurrency(t.valor));
    }
    return {
      entradas,
      saidas,
      poupado: entradas - saidas,
      taxaPoupanca: entradas > 0 ? ((entradas - saidas) / entradas) * 100 : 0,
    };
  }, [filteredSaidas]);

  const hasFilter = filterCategoria || filterSubcategoria;

  return (
    <div className="flex flex-col gap-4">
      {/* ── Filtros de Categoria e Subcategoria ── */}
      <div
        className="border-2 border-[#7b2d8e] bg-[#e8d0f0] p-3"
        style={{
          boxShadow: "inset 1px 1px 0 #fff0fc, inset -1px -1px 0 #7b2d8e",
        }}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-bold text-[#3d1a5c]">
            Filtrar Gastos
          </span>
          {hasFilter && (
            <button
              onClick={() => {
                playClick();
                setFilterCategoria("");
                setFilterSubcategoria("");
              }}
              className="border border-[#7b2d8e] bg-[#fff0fc] px-2 py-0.5 text-xs text-[#d4467a] hover:bg-[#e8a4c8]"
            >
              Limpar filtros ✕
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <RetroDropdown
            label="Categoria"
            value={filterCategoria}
            options={allCategorias}
            onChange={handleCategoriaChange}
          />
          <RetroDropdown
            label="Subcategoria"
            value={filterSubcategoria}
            options={subcategoriaOptions}
            onChange={setFilterSubcategoria}
          />
        </div>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <DashCard
          label="Total Entradas"
          value={`R$ ${formatCurrency(totals.entradas)}`}
          colorClass="border-positive bg-positive-light"
          shadowVar="inset 1px 1px 0 var(--positive-lighter), inset -1px -1px 0 var(--positive)"
          textClass="text-positive-dark"
        />
        <DashCard
          label={hasFilter ? "Saídas (filtrado)" : "Total Saídas"}
          value={`R$ ${formatCurrency(totals.saidas)}`}
          colorClass="border-danger bg-danger-light"
          shadowVar="inset 1px 1px 0 var(--danger-lighter), inset -1px -1px 0 var(--danger)"
          textClass="text-danger-dark"
        />
        <DashCard
          label="Total Poupado"
          value={`R$ ${formatCurrency(totals.poupado)}`}
          colorClass="border-info bg-info-light"
          shadowVar="inset 1px 1px 0 var(--info-lighter), inset -1px -1px 0 var(--info)"
          textClass="text-info-dark"
        />
        <DashCard
          label="Taxa de Poupança"
          value={`${totals.taxaPoupanca.toFixed(1)}%`}
          colorClass="border-[#7b2d8e] bg-[#d4b8e8]"
          shadowVar="inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e"
          textClass="text-[#3d1a5c]"
        />
      </div>

      {/* Barra de progresso: gastos vs entradas */}
      <div
        className="border-2 border-[#7b2d8e] bg-[#d4b8e8] p-3"
        style={{
          boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e",
        }}
      >
        <div className="mb-1 flex justify-between text-sm text-[#3d1a5c]">
          <span>Gastos com relação às Entradas</span>
          <span>
            {totals.entradas > 0
              ? ((totals.saidas / totals.entradas) * 100).toFixed(1)
              : "0.0"}
            %
          </span>
        </div>
        <div
          className="h-5 border-2 border-[#7b2d8e] bg-[#fff0fc]"
          style={{
            boxShadow: "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
          }}
        >
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${totals.entradas > 0 ? Math.min((totals.saidas / totals.entradas) * 100, 100) : 0}%`,
              background:
                "repeating-linear-gradient(90deg, var(--danger) 0px, var(--danger) 8px, var(--danger-dark) 8px, var(--danger-dark) 16px)",
            }}
          />
        </div>
      </div>

      {/* Gráfico de barras: Entradas vs Saídas por mês */}
      <div
        className="border-2 border-[#7b2d8e] bg-[#fff0fc] p-3"
        style={{
          boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e",
        }}
      >
        <div className="mb-2 border-b border-[#d4b8e8] pb-1 text-sm text-[#3d1a5c]">
          Entradas vs Saídas por Mês
          {hasFilter && (
            <span className="ml-1 text-xs text-[#d4467a]">(filtrado)</span>
          )}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} barGap={2}>
            <XAxis
              dataKey="mes"
              tick={{ fill: "#3d1a5c", fontSize: 12 }}
              axisLine={{ stroke: "#7b2d8e" }}
              tickLine={{ stroke: "#7b2d8e" }}
            />
            <YAxis
              tick={{ fill: "#3d1a5c", fontSize: 11 }}
              axisLine={{ stroke: "#7b2d8e" }}
              tickLine={{ stroke: "#7b2d8e" }}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<RetroTooltip />} />
            <Bar dataKey="Entradas" fill="#6a9a6a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Saidas" fill="#d4467a" radius={[0, 0, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficos de pizza: categoria */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Pizza 1: % sobre total de saídas por categoria */}
        <RetroPieCard
          title="% por Categoria sobre Saídas"
          data={categoryData}
          colors={PIE_COLORS}
        />
        {/* Pizza 2: % sobre total de entradas por categoria */}
        <RetroPieCard
          title="% por Categoria sobre Entradas"
          data={categoryVsEntradasData}
          colors={PIE_COLORS}
        />
      </div>

      {/* Gráfico de pizza: subcategoria */}
      {subcategoryData.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <RetroPieCard
            title={`Subcategorias${filterCategoria ? ` de ${filterCategoria}` : ""} sobre Saídas`}
            data={subcategoryData}
            colors={[...PIE_COLORS].reverse()}
          />
          {/* Tabela detalhada de subcategorias */}
          <div
            className="border-2 border-[#7b2d8e] bg-[#fff0fc] p-3"
            style={{
              boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e",
            }}
          >
            <div className="mb-2 border-b border-[#d4b8e8] pb-1 text-sm text-[#3d1a5c]">
              Detalhamento por Subcategoria
            </div>
            <div
              className="border-2 border-[#7b2d8e]"
              style={{
                boxShadow: "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
              }}
            >
              <div className="grid grid-cols-3 border-b-2 border-[#7b2d8e] bg-[#7b2d8e] text-xs text-[#fff0fc]">
                <div className="border-r border-[#9b4dae] px-2 py-1">
                  Subcategoria
                </div>
                <div className="border-r border-[#9b4dae] px-2 py-1">Valor</div>
                <div className="px-2 py-1">% Saídas</div>
              </div>
              {subcategoryData.map((row, i) => (
                <div
                  key={row.name}
                  className="grid grid-cols-3 border-b border-[#b898cc] bg-[#fff0fc] text-xs hover:bg-[#e8d0f0]"
                >
                  <div className="flex items-center gap-1 border-r border-[#d4b8e8] px-2 py-1 text-[#3d1a5c]">
                    <span
                      className="inline-block h-2 w-2 shrink-0 border border-[#3d1a5c]"
                      style={{
                        backgroundColor: [...PIE_COLORS].reverse()[
                          i % PIE_COLORS.length
                        ],
                      }}
                    />
                    {row.name}
                  </div>
                  <div className="border-r border-[#d4b8e8] px-2 py-1 text-danger">
                    R$ {formatCurrency(row.value)}
                  </div>
                  <div className="px-2 py-1 text-[#3d1a5c]">
                    {row.customPercent.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabela: poupança por mês */}
      <div
        className="border-2 border-[#7b2d8e]"
        style={{
          boxShadow: "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
        }}
      >
        <div className="grid grid-cols-4 border-b-2 border-[#7b2d8e] bg-[#7b2d8e] text-sm text-[#fff0fc]">
          <div className="border-r border-[#9b4dae] px-3 py-1.5">Mês</div>
          <div className="border-r border-[#9b4dae] px-3 py-1.5">Entradas</div>
          <div className="border-r border-[#9b4dae] px-3 py-1.5">Saídas</div>
          <div className="px-3 py-1.5">Poupado</div>
        </div>
        {monthlyData.map((row) => (
          <div
            key={row.mes}
            className="grid grid-cols-4 border-b border-[#b898cc] bg-[#fff0fc] text-sm hover:bg-[#e8d0f0]"
          >
            <div className="border-r border-[#d4b8e8] px-3 py-1.5 text-[#3d1a5c]">
              {row.mes}
            </div>
            <div className="border-r border-[#d4b8e8] px-3 py-1.5 text-positive">
              R$ {formatCurrency(row.Entradas)}
            </div>
            <div className="border-r border-[#d4b8e8] px-3 py-1.5 text-danger">
              R$ {formatCurrency(row.Saidas)}
            </div>
            <div
              className={`px-3 py-1.5 ${
                row.Poupado >= 0 ? "text-info-dark" : "text-danger"
              }`}
            >
              R$ {formatCurrency(row.Poupado)}
            </div>
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between border-2 border-[#7b2d8e] bg-[#d4b8e8] px-3 py-1 text-sm text-[#3d1a5c]"
        style={{
          boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e",
        }}
      >
        <span>
          {filteredSaidas.length} saídas{hasFilter ? " (filtrado)" : ""} ·{" "}
          {transactions.length} movimentações
        </span>
        <span>
          {categoryData.length} categorias · {subcategoryData.length}{" "}
          subcategorias
        </span>
      </div>
    </div>
  );
}

// ── Componente de card de pizza reutilizável ──
function RetroPieCard({
  title,
  data,
  colors,
}: {
  title: string;
  data: Array<{ name: string; value: number; customPercent: number }>;
  colors: string[];
}) {
  return (
    <div
      className="border-2 border-[#7b2d8e] bg-[#fff0fc] p-3"
      style={{
        boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e",
      }}
    >
      <div className="mb-2 border-b border-[#d4b8e8] pb-1 text-sm text-[#3d1a5c]">
        {title}
      </div>
      {data.length === 0 ? (
        <div className="flex h-50 items-center justify-center text-sm text-[#b898cc]">
          Sem dados para exibir
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={30}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                stroke="#fff0fc"
                strokeWidth={2}
                label={({ index }: { index: number }) => {
                  const cat = data[index];
                  if (!cat) return "";
                  const n =
                    cat.name.length > 12
                      ? cat.name.slice(0, 12) + "…"
                      : cat.name;
                  return `${n} ${cat.customPercent.toFixed(0)}%`;
                }}
                labelLine={{ stroke: "#7b2d8e", strokeWidth: 1 }}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<RetroPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 px-1">
            {data.map((cat, i) => (
              <div
                key={cat.name}
                className="flex items-center gap-1 text-xs text-[#3d1a5c]"
              >
                <span
                  className="inline-block h-2.5 w-2.5 border border-[#3d1a5c]"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                {cat.name} ({cat.customPercent.toFixed(1)}%)
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DashCard({
  label,
  value,
  colorClass,
  shadowVar,
  textClass,
}: {
  label: string;
  value: string;
  colorClass: string;
  shadowVar: string;
  textClass: string;
}) {
  return (
    <div
      className={`border-2 p-3 ${colorClass}`}
      style={{ boxShadow: shadowVar }}
    >
      <div className={`text-xs ${textClass}`}>{label}</div>
      <div className={`text-xl ${textClass}`}>{value}</div>
    </div>
  );
}
