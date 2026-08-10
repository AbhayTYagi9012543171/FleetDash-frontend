export interface VehicleUtilization {
name: "Active" | "Idle" | "Offline";
value: number;
}

// ======================================================
// VEHICLE UTILIZATION DATA
// ======================================================

export const vehicleUtilizationData: VehicleUtilization[] = [
{
name: "Active",
value: 70,
},
{
name: "Idle",
value: 20,
},
{
name: "Offline",
value: 10,
},
];

// ======================================================
// UTILIZATION SUMMARY
// ======================================================

export const vehicleUtilizationSummary = {
totalVehicles: vehicleUtilizationData.reduce(
(total, item) => total + item.value,
0
),

activeVehicles:
vehicleUtilizationData.find(
(item) => item.name === "Active"
)?.value ?? 0,

idleVehicles:
vehicleUtilizationData.find(
(item) => item.name === "Idle"
)?.value ?? 0,

offlineVehicles:
vehicleUtilizationData.find(
(item) => item.name === "Offline"
)?.value ?? 0,
};

// ======================================================
// PERCENTAGE HELPER
// ======================================================

export const getUtilizationPercentage = (
value: number
): number => {
const total =
vehicleUtilizationSummary.totalVehicles;

if (total === 0) {
return 0;
}

return Math.round((value / total) * 100);
};

// ======================================================
// FORMATTER
// ======================================================

export const formatUtilization = (
value: number
): string => {
return `${value}%`;
};
