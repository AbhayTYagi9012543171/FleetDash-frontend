export interface FuelTrend {
day: string;
fuel: number;
}

export const fuelTrendData: FuelTrend[] = [
{
day: "Mon",
fuel: 520,
},
{
day: "Tue",
fuel: 610,
},
{
day: "Wed",
fuel: 480,
},
{
day: "Thu",
fuel: 700,
},
{
day: "Fri",
fuel: 640,
},
{
day: "Sat",
fuel: 590,
},
{
day: "Sun",
fuel: 680,
},
];

// ======================================================
// FUEL ANALYTICS
// ======================================================

export const fuelTrendSummary = {
totalFuel: fuelTrendData.reduce(
(total, item) => total + item.fuel,
0
),

averageFuel:
fuelTrendData.length > 0
? Math.round(
fuelTrendData.reduce(
(total, item) => total + item.fuel,
0
) / fuelTrendData.length
)
: 0,

highestConsumption:
fuelTrendData.length > 0
? Math.max(
...fuelTrendData.map(
(item) => item.fuel
)
)
: 0,

lowestConsumption:
fuelTrendData.length > 0
? Math.min(
...fuelTrendData.map(
(item) => item.fuel
)
)
: 0,

highestConsumptionDay:
fuelTrendData.length > 0
? fuelTrendData.reduce((highest, item) =>
item.fuel > highest.fuel
? item
: highest
)
: null,

lowestConsumptionDay:
fuelTrendData.length > 0
? fuelTrendData.reduce((lowest, item) =>
item.fuel < lowest.fuel
? item
: lowest
)
: null,
};

// ======================================================
// FORMATTER
// ======================================================

export const formatFuel = (
fuel: number
): string => {
return `${fuel.toLocaleString()} L`;
};
