import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardHealth, PredictionDashboard, PredictionHorizon } from '../models/prediction-dashboard.model';

@Injectable({ providedIn: 'root' })
export class PredictionDashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getDates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/api/dashboard/dates`);
  }

  getDashboard(date: string, horizon: PredictionHorizon, top = 50): Observable<PredictionDashboard> {
    const params = new HttpParams()
      .set('date', date)
      .set('recommendationHorizon', horizon)
      .set('top', top);
    return this.http.get<PredictionDashboard>(`${this.apiUrl}/api/dashboard/predictions`, { params });
  }

  getHealth(): Observable<DashboardHealth> {
    return this.http.get<DashboardHealth>(`${this.apiUrl}/api/dashboard/health`);
  }

  run(date: string, margin: number): Observable<unknown> {
    const params = new HttpParams().set('date', date).set('safetyMargin', margin.toFixed(2));
    return this.http.post(`${this.apiUrl}/api/predictions/run`, null, { params });
  }

  exportCsv(date: string, horizon: PredictionHorizon): Observable<Blob> {
    const params = new HttpParams().set('date', date).set('recommendationHorizon', horizon);
    return this.http.get(`${this.apiUrl}/api/dashboard/export`, { params, responseType: 'blob' });
  }
}
