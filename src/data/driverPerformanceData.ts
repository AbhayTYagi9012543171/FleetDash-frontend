export interface DriverPerformance {
name: string;
trips: number;
distance: number;
safetyScore: number;
status: "Excellent" | "Good" | "Average";
}

export const driverPerformanceData: DriverPerformance[] = [
{
name: "Rahul Sharma",
trips: 120,
distance: 4200,
safetyScore: 98,
status: "Excellent",
},
{
name: "Amit Kumar",
trips: 105,
distance: 3800,
safetyScore: 94,
status: "Excellent",
},
{
name: "Suresh Yadav",
trips: 95,
distance: 3400,
safetyScore: 91,
status: "Good",
},
{
name: "Vikas Singh",
trips: 88,
distance: 3100,
safetyScore: 87,
status: "Good",
},
];

// ======================================================
// HELPERS
// ======================================================

export const getDriverPerformanceStatus = (
safetyScore: number
): DriverPerformance["status"] => {
if (safetyScore >= 95) {
return "Excellent";
}

if (safetyScore >= 85) {
return "Good";
}

return "Average";
};

// ======================================================
// FORMATTING HELPERS
// ======================================================

export const formatDistance = (
distance: number
): string => {
return `${distance.toLocaleString()} KM`;
};

// ======================================================
// SUMMARY
// ======================================================

export const driverPerformanceSummary = {
totalDrivers: driverPerformanceData.length,

totalTrips: driverPerformanceData.reduce(
(total, driver) => total + driver.trips,
0
),

totalDistance: driverPerformanceData.reduce(
(total, driver) => total + driver.distance,
0
),

averageSafetyScore:
driverPerformanceData.length > 0
? Math.round(
driverPerformanceData.reduce(
(total, driver) =>
total + driver.safetyScore,
0
) / driverPerformanceData.length
)
: 0,
};
