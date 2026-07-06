import {
  Building2,
  Map,
  MapPin,
  Landmark,
  School,
  Building,
  Users,
  UserCog,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard, type StatCardAccent } from "@/components/dashboard/StatCard";
import { DatabaseStatusCard } from "@/components/dashboard/DatabaseStatusCard";
import { getDashboardData } from "@/lib/dashboard";
import type { LucideIcon } from "lucide-react";

interface StatCardConfig {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: StatCardAccent;
}

export default async function DashboardPage() {
  const { stats, databaseStatus } = await getDashboardData();

  const statCards: StatCardConfig[] = [
    { label: "Municipality Types", value: stats.municipalityTypes, icon: Building2, accent: "indigo" },
    { label: "Provinces", value: stats.provinces, icon: Map, accent: "sky" },
    { label: "Districts", value: stats.districts, icon: MapPin, accent: "violet" },
    { label: "Local Levels", value: stats.localLevels, icon: Landmark, accent: "amber" },
    { label: "Schools", value: stats.schools, icon: School, accent: "emerald" },
    { label: "Campuses", value: stats.campuses, icon: Building, accent: "rose" },
    { label: "Students", value: stats.students, icon: Users, accent: "indigo" },
    { label: "Teachers", value: stats.teachers, icon: UserCog, accent: "sky" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Live overview of the Nepal Continuous Assessment ERP System."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="mt-6 max-w-md">
        <DatabaseStatusCard status={databaseStatus} />
      </div>
    </div>
  );
}
