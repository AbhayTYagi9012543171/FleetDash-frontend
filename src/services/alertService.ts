import { api } from "./api";

export interface Alert {
  _id: string;
  title: string;
  message: string;
  type: string;
  status: string;
  createdAt: string;
}

interface AlertResponse {
  success: boolean;
  count: number;
  alerts: Alert[];
}

export const alertService = {
  async getAlerts(): Promise<Alert[]> {
    const response = await api.get<AlertResponse>("/alerts");

    return response.data.alerts;
  },

  async getAlertById(id: string): Promise<Alert> {
    const response = await api.get<{
      success: boolean;
      alert: Alert;
    }>(`/alerts/${id}`);

    return response.data.alert;
  },
};