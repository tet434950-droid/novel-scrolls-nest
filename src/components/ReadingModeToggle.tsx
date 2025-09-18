import { BookOpen, Minus, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReadingMode } from '@/contexts/ReadingModeContext';

export default function ReadingModeToggle() {
  const {
    isReadingMode,
    toggleReadingMode,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize
  } = useReadingMode();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={isReadingMode ? "default" : "ghost"}
        size="sm"
        onClick={toggleReadingMode}
        className="flex items-center space-x-2"
        aria-label="Alternar modo leitura"
      >
        <BookOpen className="h-4 w-4" />
        <span className="hidden sm:inline">Modo Leitura</span>
      </Button>
      
      {isReadingMode && (
        <div className="flex items-center space-x-1 border-l border-border pl-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={decreaseFontSize}
            className="w-8 h-8 p-0"
            aria-label="Diminuir fonte"
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="text-xs text-muted-foreground min-w-[2rem] text-center">
            {fontSize}px
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={increaseFontSize}
            className="w-8 h-8 p-0"
            aria-label="Aumentar fonte"
          >
            <Plus className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFontSize}
            className="w-8 h-8 p-0"
            aria-label="Resetar fonte"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}