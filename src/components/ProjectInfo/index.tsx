import { Code2, Github, Linkedin } from 'lucide-react';

const ProjectInfo = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-4 sm:mb-6">
        <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Sobre Este Projeto
        </h2>
      </div>
      <div className="space-y-4 text-gray-700">
        <p>
          Esta calculadora foi criada por <strong>Caio Lemes</strong> com a proposta de oferecer uma ferramenta gratuita, simples e sem anúncios, que ajude as pessoas a entenderem melhor o potencial dos seus investimentos.
        </p>
        <p>
          A ideia é tornar os juros compostos mais acessíveis e incentivar o planejamento financeiro de longo prazo de forma clara e prática.
        </p>
        
        <div className="flex justify-center pt-2">
          <div className="flex items-center space-x-6 border rounded-full px-6 py-2 bg-white shadow-sm">
            <a href="https://github.com/clopso" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com/in/caio-lemes" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;