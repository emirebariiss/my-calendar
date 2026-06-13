import { ActiveWorkflows } from "@/components/dashboard/ActiveWorkflows";
import { OverdueSection } from "@/components/dashboard/OverdueSection";
import { TodayTasks } from "@/components/dashboard/TodayTasks";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { UpcomingReminders } from "@/components/dashboard/UpcomingReminders";
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Günün Özeti</h3>
        <p className="text-sm text-muted">
          Mock veriden yüklenen görevler, etkinlikler ve süreçler.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TodayTasks />
        <UpcomingEvents />
        <UpcomingReminders />
        <ActiveWorkflows />
        <OverdueSection />
      </div>
    </div>
  );
}
