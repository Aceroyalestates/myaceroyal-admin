import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface DashboardKpis {
  totalRevenue: number;
  mtdRevenue: number;
  activeRealtors: number;
  totalCustomers: number;
  conversionRate: number; // 0..1
  arpu: number;
}

export interface TimeRangeFilters {
  fromDate?: string; // yyyy-mm-dd
  toDate?: string;   // yyyy-mm-dd
  propertyType?: string;
  location?: string;
  realtorId?: string;
  method?: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardAnalyticsService {
  getOverviewKpis(filters: TimeRangeFilters): Observable<DashboardKpis> {
    if (environment.mock) {
      return of({
        totalRevenue: 425_000_000,
        mtdRevenue: 38_500_000,
        activeRealtors: 87,
        totalCustomers: 2_316,
        conversionRate: 0.123,
        arpu: 183_000,
      });
    }
    // TODO: integrate with real endpoint
    return of({ totalRevenue: 0, mtdRevenue: 0, activeRealtors: 0, totalCustomers: 0, conversionRate: 0, arpu: 0 });
  }

  getRevenueSeries(filters: TimeRangeFilters): Observable<{ labels: string[]; data: number[] }> {
    if (environment.mock) {
      const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const data = [12,18,14,22,30,28,35,40,38,45,48,52].map(n => n * 1_000_000);
      return of({ labels, data });
    }
    return of({ labels: [], data: [] });
  }

  getPaymentsByMethod(filters: TimeRangeFilters): Observable<{ labels: string[]; data: number[] }> {
    if (environment.mock) {
      return of({ labels: ['Paystack','Bank Transfer','Cheque','Cash'], data: [54,32,8,6] });
    }
    return of({ labels: [], data: [] });
  }

  getPropertyStatus(filters: TimeRangeFilters): Observable<{ labels: string[]; data: number[] }> {
    if (environment.mock) {
      return of({ labels: ['Available','Pending','Sold'], data: [72, 28, 180] });
    }
    return of({ labels: [], data: [] });
  }

  getTopRealtors(filters: TimeRangeFilters): Observable<{ labels: string[]; data: number[] }> {
    if (environment.mock) {
      return of({ labels: ['Realtor A','Realtor B','Realtor C','Realtor D','Realtor E'], data: [24,19,15,12,9] });
    }
    return of({ labels: [], data: [] });
  }

  getFunnel(filters: TimeRangeFilters): Observable<{ labels: string[]; data: number[] }> {
    if (environment.mock) {
      // Inquiry → Form → Review → Purchase → Payment
      return of({ labels: ['Inquiry','Form','Review','Purchase','Payment'], data: [1200, 740, 460, 210, 168] });
    }
    return of({ labels: [], data: [] });
  }
}

