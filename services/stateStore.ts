
import { Appointment, HealthRecord, User, Page } from '../types';

export interface AppNotification {
  id: string;
  fromName: string;
  message: string;
  timestamp: number;
  isRead: boolean;
}

class StateStore {
  private user: User | null = null;
  private appointments: Appointment[] = [];
  private healthRecords: HealthRecord[] = [];
  private currentPage: Page = Page.LOGIN;
  private notifications: AppNotification[] = [];

  // Map of doctorId -> array of available time slots
  private doctorAvailability: Record<string, string[]> = {
    'doc1': ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"],
    'doc2': ["10:00 AM", "11:00 AM", "12:00 PM", "04:00 PM"],
    'doc3': ["09:00 AM", "02:00 PM", "05:00 PM", "06:00 PM"],
    'doc4': ["11:00 AM", "12:00 PM", "03:00 PM"]
  };

  setUser(user: User | null) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  setPage(page: Page) {
    this.currentPage = page;
  }

  getPage() {
    return this.currentPage;
  }

  addAppointment(app: Appointment) {
    this.appointments.push(app);
  }

  getAppointments() {
    return this.appointments;
  }

  updateDoctorAvailability(doctorId: string, slots: string[]) {
    this.doctorAvailability[doctorId] = slots;
  }

  getDoctorAvailability(doctorId: string): string[] {
    return this.doctorAvailability[doctorId] || ["09:00 AM", "10:00 AM", "11:00 AM"];
  }

  addHealthRecord(rec: HealthRecord) {
    this.healthRecords.push(rec);
  }

  getHealthRecords() {
    return this.healthRecords;
  }

  // Notification methods
  addNotification(fromName: string, message: string) {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      fromName,
      message,
      timestamp: Date.now(),
      isRead: false
    };
    this.notifications = [newNotif, ...this.notifications];
  }

  getNotifications() {
    return this.notifications;
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.isRead).length;
  }

  markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
  }

  clearNotifications() {
    this.notifications = [];
  }
}

export const store = new StateStore();
