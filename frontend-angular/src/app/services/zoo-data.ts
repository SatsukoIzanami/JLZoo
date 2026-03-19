import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Animal } from '../models/animal';
import { ApiClient } from './api-client';

@Injectable({ providedIn: 'root' })
export class ZooDataService extends ApiClient {
  constructor(private readonly http: HttpClient) {
    super();
  }

  getAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[] | { animals: Animal[] }>(`${environment.apiBase}/animals`).pipe(
      map((data) => (Array.isArray(data) ? data : data.animals ?? []))
    );
  }

  createAnimal(payload: Animal): Observable<Animal> {
    return this.http.post<Animal>(`${environment.apiBase}/animals`, payload);
  }
}
