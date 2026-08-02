import type { IconType } from "react-icons";

export interface DashboardStat {

  title: string;

  value: string;

  icon: IconType;

  color: string;

  description: string;

  trend?: string;

}