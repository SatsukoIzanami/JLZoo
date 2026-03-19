import { Observable } from 'rxjs';
import { Animal } from '../models/animal';

export abstract class ApiClient {
  abstract getAnimals(): Observable<Animal[]>;
  abstract createAnimal(payload: Animal): Observable<Animal>;
}
