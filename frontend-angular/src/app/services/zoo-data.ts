import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { getZooApiBase, resolveZooImageUrl } from '../config/api-base';
import { Animal } from '../models/animal';
import { ApiClient } from './api-client';

@Injectable({ providedIn: 'root' })
export class ZooDataService extends ApiClient {
  constructor(private readonly http: HttpClient) {
    super();
  }

  private apiUrl(path: string): string {
    const base = getZooApiBase().replace(/\/$/, '');
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private withResolvedImages(a: Animal): Animal {
    return { ...a, image: resolveZooImageUrl(a.image) };
  }

  getAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[] | { animals: Animal[] }>(this.apiUrl('/animals')).pipe(
      map((data) => {
        const list = Array.isArray(data) ? data : data.animals ?? [];
        return list.map((animal) => this.withResolvedImages(animal));
      })
    );
  }

  createAnimal(payload: Animal): Observable<Animal> {
    return this.http
      .post<Animal>(this.apiUrl('/animals'), payload)
      .pipe(map((saved) => this.withResolvedImages(saved)));
  }
}
