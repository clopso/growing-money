import { useState } from 'react';
import { PiggyBank, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Juros Compostos', href: '#', active: true },
    { name: 'Simular Resgates', href: '#', active: false },
    // { name: 'Calculadora de PLR', href: '#', active: false },
    // Adicione novos links aqui no futuro
  ];

  return (
    <nav className="sticky top-4 z-50 max-w-7xl mx-auto mb-8 lg:mb-12">
      <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg p-4 px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <PiggyBank className="w-7 h-7 text-blue-600" />
          <span className="text-xl font-bold text-gray-800 hidden sm:inline">
            Growing Money
          </span>
        </a>

        {/* Botão do Menu (agora visível em todas as telas) */}
        <div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-200/50 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Dropdown (agora sem restrição de tela) */}
      {isMenuOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-lg p-2"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={`block text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                    link.active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;