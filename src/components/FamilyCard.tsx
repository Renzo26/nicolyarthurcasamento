import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FamilyCardProps {
  nomeLider: string;
  totalConvidados: number;
  onClick: () => void;
}

const FamilyCard = ({ nomeLider, totalConvidados, onClick }: FamilyCardProps) => {
  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-border/60"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-card-foreground text-lg leading-tight">
              {nomeLider}
            </h3>
            <p className="text-muted-foreground text-sm flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {totalConvidados} {totalConvidados === 1 ? "convidado" : "convidados"}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-sm">
              {nomeLider.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FamilyCard;
