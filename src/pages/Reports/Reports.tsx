import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiActivity,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiFileText,
  FiFilter,
  FiPrinter,
  FiRefreshCw,
  FiSearch,
  FiTrendingUp,
  FiTruck,
  FiX,
} from "react-icons/fi";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { api } from "../../services/api";

// ======================================================
// TYPES
// ======================================================

interface Report {
  _id: string;
  title: string;
  reportType: string;
  description?: string;
  generatedBy?: string;
  createdAt: string;
}

// ======================================================
// COMPONENT
// ======================================================

const Reports = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [reports, setReports] = useState<Report[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [refreshing, setRefreshing] =
    useState<boolean>(false);

  const [search, setSearch] =
    useState<string>("");

  const [type, setType] =
    useState<string>("All");

  const [error, setError] =
    useState<string>("");

  // ====================================================
  // FETCH REPORTS
  // ====================================================

  const fetchReports = useCallback(
    async () => {
      try {
        setError("");
        setRefreshing(true);

        const response =
          await api.get("/reports");

        console.log(
          "Reports Response:",
          response.data
        );

        const data =
          response?.data?.reports ??
          response?.data?.data ??
          response?.data ??
          [];

        if (Array.isArray(data)) {
          setReports(data);
        } else {
          setReports([]);
        }
      } catch (err: any) {
        console.error(
          "Report Error:",
          err?.response?.data ||
            err?.message ||
            err
        );

        setReports([]);

        setError(
          err?.response?.data?.message ||
            "Unable to load reports."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // ====================================================
  // REPORT TYPES
  // ====================================================

  const reportTypes = useMemo(() => {
    const types = reports
      .map((report) => report.reportType)
      .filter(Boolean);

    return Array.from(
      new Set(types)
    );
  }, [reports]);

  // ====================================================
  // FILTER REPORTS
  // ====================================================

  const filteredReports = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return reports.filter((report) => {
      const title =
        report.title
          ?.toLowerCase()
          .trim() || "";

      const description =
        report.description
          ?.toLowerCase()
          .trim() || "";

      const generatedBy =
        report.generatedBy
          ?.toLowerCase()
          .trim() || "";

      const reportType =
        report.reportType
          ?.toLowerCase()
          .trim() || "";

      const searchMatch =
        !searchValue ||
        title.includes(searchValue) ||
        description.includes(searchValue) ||
        generatedBy.includes(searchValue) ||
        reportType.includes(searchValue);

      const typeMatch =
        type === "All" ||
        report.reportType === type;

      return (
        searchMatch &&
        typeMatch
      );
    });
  }, [
    reports,
    search,
    type,
  ]);

  // ====================================================
  // STATISTICS
  // ====================================================

  const statistics = useMemo(() => {
    const total =
      reports.length;

    const daily =
      reports.filter(
        (report) =>
          report.reportType
            ?.toLowerCase() === "daily"
      ).length;

    const vehicle =
      reports.filter(
        (report) =>
          report.reportType
            ?.toLowerCase() === "vehicle"
      ).length;

    const fuel =
      reports.filter(
        (report) =>
          report.reportType
            ?.toLowerCase() === "fuel"
      ).length;

    const other =
      Math.max(
        total -
          daily -
          vehicle -
          fuel,
        0
      );

    return {
      total,
      daily,
      vehicle,
      fuel,
      other,
    };
  }, [reports]);

  // ====================================================
  // FORMAT DATE
  // ====================================================

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "N/A";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "N/A";
    }

    return parsed.toLocaleDateString(
      undefined,
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ====================================================
  // FORMAT TIME
  // ====================================================

  const formatTime = (
    date?: string
  ) => {
    if (!date) {
      return "";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "";
    }

    return parsed.toLocaleTimeString(
      undefined,
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ====================================================
  // REPORT TYPE STYLE
  // ====================================================

  const getTypeStyle = (
    reportType?: string
  ) => {
    switch (
      reportType?.toLowerCase()
    ) {
      case "daily":
        return {
          badge:
            "border-blue-200 bg-blue-50 text-blue-700",
          icon:
            "bg-blue-100 text-blue-600",
        };

      case "vehicle":
        return {
          badge:
            "border-violet-200 bg-violet-50 text-violet-700",
          icon:
            "bg-violet-100 text-violet-600",
        };

      case "fuel":
        return {
          badge:
            "border-amber-200 bg-amber-50 text-amber-700",
          icon:
            "bg-amber-100 text-amber-600",
        };

      case "maintenance":
        return {
          badge:
            "border-orange-200 bg-orange-50 text-orange-700",
          icon:
            "bg-orange-100 text-orange-600",
        };

      default:
        return {
          badge:
            "border-slate-200 bg-slate-50 text-slate-700",
          icon:
            "bg-slate-100 text-slate-600",
        };
    }
  };

  // ====================================================
  // EXPORT EXCEL
  // ====================================================

  const exportExcel = () => {
    if (
      filteredReports.length === 0
    ) {
      return;
    }

    const data =
      filteredReports.map(
        (report) => ({
          Title:
            report.title || "Untitled",

          Type:
            report.reportType || "Other",

          Description:
            report.description || "",

          GeneratedBy:
            report.generatedBy ||
            "System",

          Date:
            formatDate(
              report.createdAt
            ),
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        data
      );

    worksheet["!cols"] = [
      { wch: 30 },
      { wch: 18 },
      { wch: 55 },
      { wch: 25 },
      { wch: 18 },
    ];

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Reports"
    );

    XLSX.writeFile(
      workbook,
      "FleetDash_Reports.xlsx"
    );
  };

  // ====================================================
  // EXPORT PDF
  // ====================================================

  const exportPDF = () => {
    if (
      filteredReports.length === 0
    ) {
      return;
    }

    const doc =
      new jsPDF();

    doc.setFontSize(20);

    doc.text(
      "FleetDash Reports",
      14,
      18
    );

    doc.setFontSize(9);

    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      14,
      25
    );

    autoTable(doc, {
      startY: 32,

      head: [
        [
          "Title",
          "Type",
          "Generated By",
          "Date",
        ],
      ],

      body:
        filteredReports.map(
          (report) => [
            report.title ||
              "Untitled",

            report.reportType ||
              "Other",

            report.generatedBy ||
              "System",

            formatDate(
              report.createdAt
            ),
          ]
        ),

      styles: {
        fontSize: 9,
        cellPadding: 4,
      },

      headStyles: {
        fillColor: [
          37,
          99,
          235,
        ],
        textColor: 255,
        fontStyle: "bold",
      },

      alternateRowStyles: {
        fillColor: [
          248,
          250,
          252,
        ],
      },
    });

    doc.save(
      "FleetDash_Reports.pdf"
    );
  };

  // ====================================================
  // PRINT
  // ====================================================

  const handlePrint = () => {
    window.print();
  };

  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const clearFilters = () => {
    setSearch("");
    setType("All");
  };

  const hasFilters =
    search.trim() !== "" ||
    type !== "All";

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">

          {/* Header Skeleton */}

          <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="h-8 w-64 rounded-lg bg-slate-100" />

            <div className="mt-3 h-4 w-96 max-w-full rounded-lg bg-slate-100" />

            <div className="mt-6 flex gap-3">
              <div className="h-10 w-28 rounded-xl bg-slate-100" />
              <div className="h-10 w-28 rounded-xl bg-slate-100" />
            </div>
          </div>

          {/* KPI Skeleton */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>

          {/* Filter Skeleton */}

          <div className="h-24 animate-pulse rounded-2xl bg-white shadow-sm" />

          {/* Table Skeleton */}

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="space-y-4 p-6">
              {Array.from({
                length: 7,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-xl bg-slate-50"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">

        {/* ==================================================
            PREMIUM HEADER
        ================================================== */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 shadow-xl sm:p-8">

          {/* Decorative elements */}

          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">

            {/* Title */}

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/10 backdrop-blur-sm">
                <FiBarChart2
                  size={27}
                />
              </div>

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                    Reports & Analytics
                  </h1>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Live Data
                  </span>

                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Analyze fleet performance, vehicle activity,
                  fuel usage, and operational reports from one
                  centralized dashboard.
                </p>

              </div>

            </div>

            {/* Header Actions */}

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={fetchReports}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiRefreshCw
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh Data"}
              </button>

              <button
                type="button"
                onClick={exportExcel}
                disabled={
                  filteredReports.length ===
                  0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiDownload />

                Export
              </button>

            </div>

          </div>
        </section>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <FiX />
                </div>

                <div>
                  <p className="font-semibold text-red-800">
                    Unable to load reports
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={fetchReports}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Retry
              </button>

            </div>

          </div>
        )}

        {/* ==================================================
            KPI CARDS
        ================================================== */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 transition group-hover:scale-125" />

            <div className="relative flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Total Reports
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {statistics.total}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <FiTrendingUp />
                  All generated reports
                </div>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiFileText
                  size={22}
                />
              </div>

            </div>

          </div>

          {/* Daily */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-50 transition group-hover:scale-125" />

            <div className="relative flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Daily Reports
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-indigo-600">
                  {statistics.daily}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <FiCalendar />
                  Daily analytics
                </div>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FiCalendar
                  size={22}
                />
              </div>

            </div>

          </div>

          {/* Vehicle */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-50 transition group-hover:scale-125" />

            <div className="relative flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Vehicle Reports
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-violet-600">
                  {statistics.vehicle}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <FiTruck />
                  Fleet activity
                </div>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <FiTruck
                  size={22}
                />
              </div>

            </div>

          </div>

          {/* Fuel */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-50 transition group-hover:scale-125" />

            <div className="relative flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Fuel Reports
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-amber-600">
                  {statistics.fuel}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <FiActivity />
                  Fuel analytics
                </div>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <FiActivity
                  size={22}
                />
              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            FILTER BAR
        ================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            {/* Left */}

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <FiFilter />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Report Explorer
                </h2>

                <p className="text-xs text-slate-500">
                  Search and filter your reports
                </p>
              </div>

            </div>

            {/* Controls */}

            <div className="flex w-full flex-col gap-3 md:flex-row xl:w-auto">

              {/* Search */}

              <div className="relative w-full md:w-80">

                <FiSearch
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search reports..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />

              </div>

              {/* Type */}

              <select
                value={type}
                onChange={(event) =>
                  setType(
                    event.target.value
                  )
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              >

                <option value="All">
                  All Report Types
                </option>

                {reportTypes.map(
                  (reportType) => (
                    <option
                      key={reportType}
                      value={reportType}
                    >
                      {reportType}
                    </option>
                  )
                )}

              </select>

              {/* Clear */}

              {hasFilters && (
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <FiX />

                  Clear
                </button>
              )}

            </div>

          </div>

        </section>

        {/* ==================================================
            REPORTS CONTAINER
        ================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Section Header */}

          <div className="border-b border-slate-100 p-5 sm:p-6">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Reports Library
                  </h2>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {filteredReports.length}
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {filteredReports.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {reports.length}
                  </span>{" "}
                  reports
                </p>

              </div>

              {/* Export Buttons */}

              <div className="grid grid-cols-3 gap-2 sm:flex">

                <button
                  type="button"
                  onClick={exportExcel}
                  disabled={
                    filteredReports.length ===
                    0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
                >
                  <FiDownload />

                  <span className="hidden sm:inline">
                    Excel
                  </span>
                </button>

                <button
                  type="button"
                  onClick={exportPDF}
                  disabled={
                    filteredReports.length ===
                    0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
                >
                  <FiDownload />

                  <span className="hidden sm:inline">
                    PDF
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={
                    filteredReports.length ===
                    0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
                >
                  <FiPrinter />

                  <span className="hidden sm:inline">
                    Print
                  </span>
                </button>

              </div>

            </div>

          </div>

          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          {filteredReports.length ===
            0 && (
            <div className="flex min-h-[400px] flex-col items-center justify-center px-6 py-16 text-center">

              <div className="relative">

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
                  <FiFileText
                    size={34}
                  />
                </div>

                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-slate-200 text-slate-500">
                  <FiSearch
                    size={12}
                  />
                </div>

              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                No reports found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {hasFilters
                  ? "No reports match your current search or filter. Try adjusting your filters."
                  : "There are currently no reports available in your FleetDash system."}
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}

            </div>
          )}

          {/* ==================================================
              DESKTOP TABLE
          ================================================== */}

          {filteredReports.length >
            0 && (
            <div className="hidden overflow-x-auto lg:block">

              <table className="min-w-full">

                <thead>

                  <tr className="border-b border-slate-100 bg-slate-50/80">

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Report
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Type
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Description
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Generated By
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredReports.map(
                    (report) => {
                      const typeStyle =
                        getTypeStyle(
                          report.reportType
                        );

                      return (
                        <tr
                          key={
                            report._id
                          }
                          className="group transition hover:bg-slate-50/80"
                        >

                          {/* Report */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                                <FiFileText />
                              </div>

                              <div className="min-w-0">

                                <p className="max-w-xs truncate font-semibold text-slate-800">
                                  {report.title ||
                                    "Untitled Report"}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  ID:{" "}
                                  {report._id
                                    ?.slice(
                                      -8
                                    ) ||
                                    "N/A"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Type */}

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${typeStyle.badge}`}
                            >
                              <span
                                className={`flex h-5 w-5 items-center justify-center rounded-md ${typeStyle.icon}`}
                              >
                                <FiBarChart2
                                  size={11}
                                />
                              </span>

                              {report.reportType ||
                                "Other"}
                            </span>

                          </td>

                          {/* Description */}

                          <td className="max-w-sm px-6 py-5">

                            <p className="line-clamp-2 text-sm leading-5 text-slate-500">
                              {report.description ||
                                "No description available."}
                            </p>

                          </td>

                          {/* Generated By */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-2">

                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                                {(
                                  report.generatedBy ||
                                  "S"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <span className="text-sm font-medium text-slate-700">
                                {report.generatedBy ||
                                  "System"}
                              </span>

                            </div>

                          </td>

                          {/* Date */}

                          <td className="px-6 py-5">

                            <div className="flex items-start gap-2">

                              <FiCalendar
                                className="mt-0.5 text-slate-400"
                                size={15}
                              />

                              <div>

                                <p className="text-sm font-medium text-slate-700">
                                  {formatDate(
                                    report.createdAt
                                  )}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">
                                  {formatTime(
                                    report.createdAt
                                  )}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Status */}

                          <td className="px-6 py-5 text-center">

                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">

                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                              Ready
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

          {/* ==================================================
              MOBILE / TABLET CARDS
          ================================================== */}

          {filteredReports.length >
            0 && (
            <div className="divide-y divide-slate-100 lg:hidden">

              {filteredReports.map(
                (report) => {
                  const typeStyle =
                    getTypeStyle(
                      report.reportType
                    );

                  return (
                    <article
                      key={
                        report._id
                      }
                      className="p-5 transition hover:bg-slate-50 sm:p-6"
                    >

                      {/* Top */}

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FiFileText />
                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate font-bold text-slate-800">
                              {report.title ||
                                "Untitled Report"}
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                              ID:{" "}
                              {report._id?.slice(
                                -8
                              )}
                            </p>

                          </div>

                        </div>

                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Ready
                        </span>

                      </div>

                      {/* Type */}

                      <div className="mt-5">

                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${typeStyle.badge}`}
                        >
                          <FiBarChart2 />

                          {report.reportType ||
                            "Other"}
                        </span>

                      </div>

                      {/* Description */}

                      <p className="mt-4 text-sm leading-6 text-slate-500">
                        {report.description ||
                          "No description available."}
                      </p>

                      {/* Metadata */}

                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <div className="rounded-xl bg-slate-50 p-3">

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Generated By
                          </p>

                          <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                            {report.generatedBy ||
                              "System"}
                          </p>

                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Created
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {formatDate(
                              report.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* ==================================================
            FOOTER SUMMARY
        ================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FiCheckCircle />
              </div>

              <div>

                <p className="text-sm font-semibold text-slate-800">
                  Reporting system operational
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  FleetDash reports are ready for analysis.
                </p>

              </div>

            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">

              <span className="inline-flex items-center gap-1.5">
                <FiFileText />
                {reports.length} Total
              </span>

              <span className="hidden h-4 w-px bg-slate-200 sm:block" />

              <span className="inline-flex items-center gap-1.5">
                <FiClock />
                Updated automatically
              </span>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
};

export default Reports;