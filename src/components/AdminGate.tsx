import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

const SESSION_KEY = "admin_authenticated";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;

/**
 * Gate simples de senha para telas administrativas.
 *
 * Isto NÃO é segurança de verdade: a senha e a comparação rodam no
 * navegador, então qualquer pessoa com DevTools pode contornar. Serve só
 * para impedir que convidados encontrem o link por acaso e mexam nos dados.
 * Proteção real depende das policies de RLS no Supabase.
 */
export default function AdminGate({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 text-foreground">
          <Lock className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Área restrita</h1>
        </div>
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          autoFocus
        />
        {error && <p className="text-sm text-destructive">Senha incorreta.</p>}
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
    </div>
  );
}
