import {
FaTruck,
FaGasPump,
FaUserTie,
FaTools,
FaCheckCircle,
FaWallet,
FaArrowUp,
FaArrowDown,
} from "react-icons/fa";

import type { IconType } from "react-icons";

// ======================================================
// TYPES
// ======================================================

export interface DashboardStat {
title: string;
value: string;
icon: IconType;
color: string;
iconBg: string;
description: string;
trend?: string;
trendType?: "up" | "down" | "neutral";
progress?: number;
}

// ======================================================
// DASHBOARD STATISTICS
// ======================================================

export const dashboardStats: DashboardStat[] = [
{
title: "Fleet Health",
value: "92%",
icon: FaTruck,
color: "bg-emerald-500",
iconBg: "bg-emerald-50 text-emerald-600",
description: "Healthy Vehicles",
trend: "+4.2%",
trendType: "up",
progress: 92,
},

{
title: "Fuel Today",
value: "640 L",
icon: FaGasPump,
color: "bg-amber-500",
iconBg: "bg-amber-50 text-amber-600",
description: "Fuel Consumed",
trend: "-8.5%",
trendType: "down",
progress: 68,
},

{
title: "Active Drivers",
value: "48",
icon: FaUserTie,
color: "bg-blue-500",
iconBg: "bg-blue-50 text-blue-600",
description: "Currently Working",
trend: "+6.1%",
trendType: "up",
progress: 80,
},

{
title: "Today's Revenue",
value: "₹1,24,000",
icon: FaWallet,
color: "bg-violet-500",
iconBg: "bg-violet-50 text-violet-600",
description: "Total Earnings",
trend: "+12.4%",
trendType: "up",
progress: 86,
},

{
title: "Vehicle Availability",
value: "86%",
icon: FaCheckCircle,
color: "bg-cyan-500",
iconBg: "bg-cyan-50 text-cyan-600",
description: "Ready to Use",
trend: "+3.8%",
trendType: "up",
progress: 86,
},

{
title: "Maintenance Due",
value: "12",
icon: FaTools,
color: "bg-red-500",
iconBg: "bg-red-50 text-red-600",
description: "Needs Service",
trend: "-2",
trendType: "down",
progress: 35,
},
];

// ======================================================
// TREND ICON HELPER
// ======================================================

export const getTrendIcon = (
trendType?: DashboardStat["trendType"]
) => {
switch (trendType) {
case "up":
return FaArrowUp;


case "down":
  return FaArrowDown;

default:
  return undefined;


}
};
