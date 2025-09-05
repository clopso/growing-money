import { BookOpen, TrendingUp, AlertTriangle } from 'lucide-react';

// Função para formatar números como moeda brasileira (R$)
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
};

const LearnMore = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 space-y-8">
      {/* --- Seção 1: O que são Juros Compostos? --- */}
      <div>
        <div className="flex items-center mb-4">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            A Mágica dos Juros Sobre Juros
          </h2>
        </div>
        <div className="space-y-4 text-gray-700">
          <p>
            Conhecidos como a "oitava maravilha do mundo" por Albert Einstein, os juros compostos são o rendimento gerado não apenas sobre o valor inicial, mas também sobre os juros acumulados. É o famoso "juros sobre juros".
          </p>
          <p>
            Esse efeito cria uma "bola de neve" positiva para seus investimentos, fazendo seu patrimônio crescer de forma exponencial ao longo do tempo. A fórmula que rege esse crescimento é:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg text-center my-4">
            <p className="text-xl font-mono text-gray-800 tracking-wider">
              M = C (1 + i)<sup>t</sup>
            </p>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>M:</strong> Montante final</li>
            <li><strong>C:</strong> Capital inicial investido</li>
            <li><strong>i:</strong> Taxa de juros (em formato decimal)</li>
            <li><strong>t:</strong> Tempo da aplicação</li>
          </ul>
          <p>
            Um detalhe crucial: a taxa de juros (<strong>i</strong>) e o tempo (<strong>t</strong>) devem estar na mesma unidade. Se a taxa é mensal, o tempo deve ser em meses.
          </p>
        </div>
      </div>

      {/* --- Seção 2: Juros Compostos vs. Juros Simples --- */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
          Compostos vs. Simples: O Impacto no Longo Prazo
        </h3>
        <p className="text-gray-700 mb-4">
          Enquanto os juros simples rendem sempre sobre o valor inicial (crescimento linear), os juros compostos rendem sobre o total acumulado (crescimento exponencial). A diferença no começo parece pequena, mas se torna gigantesca com o passar dos anos.
        </p>
        <p className="text-gray-700 mb-4">
          Veja a simulação de um investimento inicial de <strong>R$ 5.000</strong> com juros de <strong>1% ao mês</strong>, sem novos aportes:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs sm:text-sm text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="py-3 px-4 sm:px-6">Período</th>
                <th className="py-3 px-4 sm:px-6 text-right">Juros Simples</th>
                <th className="py-3 px-4 sm:px-6 text-right">Juros Compostos</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b"><td className="py-3 px-4 sm:px-6">5 anos</td><td className="py-3 px-4 sm:px-6 text-right">{formatCurrency(8000)}</td><td className="py-3 px-4 sm:px-6 text-right font-semibold text-blue-800">{formatCurrency(9083.48)}</td></tr>
              <tr className="border-b"><td className="py-3 px-4 sm:px-6">10 anos</td><td className="py-3 px-4 sm:px-6 text-right">{formatCurrency(11000)}</td><td className="py-3 px-4 sm:px-6 text-right font-semibold text-blue-800">{formatCurrency(16501.93)}</td></tr>
              <tr className="border-b"><td className="py-3 px-4 sm:px-6">20 anos</td><td className="py-3 px-4 sm:px-6 text-right">{formatCurrency(17000)}</td><td className="py-3 px-4 sm:px-6 text-right font-semibold text-blue-800">{formatCurrency(54462.77)}</td></tr>
              <tr className="border-b"><td className="py-3 px-4 sm:px-6">30 anos</td><td className="py-3 px-4 sm:px-6 text-right">{formatCurrency(23000)}</td><td className="py-3 px-4 sm:px-6 text-right font-bold text-blue-800">{formatCurrency(179748.21)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Seção 3: Onde os Juros Compostos Atuam --- */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
          Juros Compostos: Amigo ou Inimigo?
        </h3>
        <p className="text-gray-700 mb-6">
          Os juros compostos são uma ferramenta poderosa. O resultado, bom ou ruim, depende de qual lado da equação você está.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lado Positivo */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center text-green-700 mb-2">
              <TrendingUp className="w-5 h-5 mr-2" />
              <h4 className="font-bold text-base">A Seu Favor: Investimentos</h4>
            </div>
            <p className="text-sm text-green-800">
              Nos investimentos (Tesouro Direto, CDBs, Ações), os juros compostos trabalham para você, multiplicando seu dinheiro. Ao reinvestir os lucros e dividendos, você acelera ainda mais a "bola de neve" e constrói seu patrimônio.
            </p>
          </div>
          {/* Lado Negativo */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center text-red-700 mb-2">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <h4 className="font-bold text-base">Contra Você: Dívidas</h4>
            </div>
            <p className="text-sm text-red-800">
              Em dívidas como financiamentos e faturas de cartão de crédito, o efeito se inverte. Os juros compostos aumentam o valor devido rapidamente, transformando uma pequena dívida em um grande problema se não for controlada.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LearnMore;