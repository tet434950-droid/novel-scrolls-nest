import { Link } from "react-router-dom";
import { BookOpen, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <BookOpen className="h-24 w-24 text-accent mx-auto mb-4 opacity-50" />
          <h1 className="text-6xl font-bold text-content-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-content-primary mb-2">
            Página não encontrada
          </h2>
          <p className="text-content-secondary">
            Parece que você se perdeu navegando pelas páginas. A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>Voltar ao início</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
