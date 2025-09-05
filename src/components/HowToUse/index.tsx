import { HelpCircle } from 'lucide-react'; // Ícone para o título

const HowToUse = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-4 sm:mb-6">
        <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Como Usar a Calculadora
        </h2>
      </div>
      <div className="space-y-4 text-gray-700">
        <p>
          Simular o futuro dos seus investimentos é muito simples. Siga os passos abaixo:
        </p>
        <ol className="list-decimal list-inside space-y-3 pl-2">
          <li>
            Preencha o <strong>Valor Inicial</strong> com a quantia que você já tem para investir. Se não tiver, pode deixar em branco ou com R$ 0.
          </li>
          <li>
            Informe o <strong>Aporte Mensal</strong>, ou seja, o valor que você planeja depositar todos os meses.
          </li>
          <li>
            No campo <strong>Taxa de Juros</strong>, insira a rentabilidade esperada do seu investimento e selecione se a taxa é anual ou mensal.
          </li>
          <li>
            Defina o <strong>Período</strong> durante o qual o dinheiro ficará investido, escolhendo entre anos ou meses.
          </li>
          <li>
            Utilize o campo <strong>Crescimento Anual do Aporte</strong> para simular um aumento percentual no seu aporte mensal a cada ano, acompanhando a sua evolução de renda.
          </li>
          <li>
            Pronto! Clique em <strong>Calcular</strong> e veja a mágica dos juros compostos acontecer no painel de resultados.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default HowToUse;