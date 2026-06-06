import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <Card title="Takvim">
        <EmptyState
          title="Takvim — Sprint 4'te gelecek"
          description="Gün, hafta ve ay görünümü ile event yönetimi bu sprintte eklenecek."
        />
      </Card>
    </div>
  );
}
