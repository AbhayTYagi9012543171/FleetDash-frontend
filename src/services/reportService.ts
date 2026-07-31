import { api } from "./api";

// ======================
// Interfaces
// ======================

export interface Report {
  _id: string;
  title: string;
  type: string;
  description?: string;
  generatedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReportFilters {
  type?: string;
  startDate?: string;
  endDate?: string;
}

interface ReportsResponse {
  success: boolean;
  count: number;
  reports: Report[];
}

interface ReportResponse {
  success: boolean;
  report: Report;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

// ======================
// Report Service
// ======================

export const reportService = {
  // Get All Reports
  async getReports(filters?: ReportFilters): Promise<Report[]> {
    const response = await api.get<ReportsResponse>("/reports", {
      params: filters,
    });

    return response.data.reports;
  },

  // Get Report By ID
  async getReportById(id: string): Promise<Report> {
    const response = await api.get<ReportResponse>(`/reports/${id}`);

    return response.data.report;
  },

  // Generate/Create Report
  async generateReport(data: Partial<Report>): Promise<Report> {
    const response = await api.post<ReportResponse>("/reports", data);

    return response.data.report;
  },

  // Delete Report
  async deleteReport(id: string): Promise<string> {
    const response = await api.delete<DeleteResponse>(`/reports/${id}`);

    return response.data.message;
  },
};