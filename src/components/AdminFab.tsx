import { Settings } from "lucide-react";

export function AdminFab() {
  return (
    <a
      href="/admin/"
      rel="nofollow noopener"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      title="Painel Administrativo"
    >
      <Settings className="h-6 w-6" />
    </a>
  );
}