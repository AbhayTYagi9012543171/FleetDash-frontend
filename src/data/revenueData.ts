export interface RevenueData {
month: string;
revenue: number;
}

// ======================================================
// MONTHLY REVENUE DATA
// ======================================================

export const revenueData: RevenueData[] = [
{
month: "Jan",
revenue: 420000,
},
{
month: "Feb",
revenue: 380000,
},
{
month: "Mar",
revenue: 510000,
},
{
month: "Apr",
revenue: 470000,
},
{
month: "May",
revenue: 620000,
},
{
month: "Jun",
revenue: 710000,
},
{
month: "Jul",
revenue: 680000,
},
{
month: "Aug",
revenue: 760000,
},
];

// ======================================================
// REVENUE ANALYTICS
// ======================================================

export const revenueSummary = {
totalRevenue: revenueData.reduce(
(total, item) => total + item.revenue,
0
),

averageRevenue:
revenueData.length > 0
? Math.round(
revenueData.reduce(
(total, item) =>
total + item.revenue,
0
) / revenueData.length
)
: 0,

highestRevenue:
revenueData.length > 0
? Math.max(
...revenueData.map(
(item) => item.revenue
)
)
: 0,

lowestRevenue:
revenueData.length > 0
? Math.min(
...revenueData.map(
(item) => item.revenue
)
)
: 0,

highestRevenueMonth:
revenueData.length > 0
? revenueData.reduce(
(highest, item) =>
item.revenue > highest.revenue
? item
: highest
)
: null,

lowestRevenueMonth:
revenueData.length > 0
? revenueData.reduce(
(lowest, item) =>
item.revenue < lowest.revenue
? item
: lowest
)
: null,
};

// ======================================================
// FORMATTERS
// ======================================================

export const formatRevenue = (
revenue: number
): string => {
return `₹${revenue.toLocaleString("en-IN")}`;
};

export const formatRevenueShort = (
revenue: number
): string => {
if (revenue >= 10000000) {
return `₹${(revenue / 10000000).toFixed(1)} Cr`;
}

if (revenue >= 100000) {
return `₹${(revenue / 100000).toFixed(1)} L`;
}

if (revenue >= 1000) {
return `₹${(revenue / 1000).toFixed(1)} K`;
}

return `₹${revenue}`;
};
