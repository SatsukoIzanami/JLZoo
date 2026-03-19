import { Injectable, signal } from '@angular/core';

export interface AdoptionRecord {
  originalName: string;
  displayName: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class AdoptionStateService {
  private readonly recordsState = signal<AdoptionRecord[]>([]);
  readonly records = this.recordsState.asReadonly();

  isAdopted(originalName: string): boolean {
    return this.recordsState().some((r) => r.originalName.toLowerCase() === originalName.toLowerCase());
  }

  displayName(originalName: string): string {
    const found = this.recordsState().find((r) => r.originalName.toLowerCase() === originalName.toLowerCase());
    return found?.displayName ?? originalName;
  }

  contactByDisplayName(displayName: string): string {
    return this.recordsState().find((r) => r.displayName === displayName)?.phone ?? '';
  }

  adopt(originalName: string, phone: string, customName: string): void {
    const base = this.capitalize(originalName);
    const custom = customName.trim();
    const displayName = custom ? `${this.capitalize(custom)} the ${base}` : base;
    const next = this.recordsState().filter((r) => r.originalName.toLowerCase() !== originalName.toLowerCase());
    next.push({ originalName, displayName, phone });
    this.recordsState.set(next);
  }

  removeByDisplayName(displayName: string): void {
    this.recordsState.set(this.recordsState().filter((r) => r.displayName !== displayName));
  }

  private capitalize(v: string): string {
    if (!v) return v;
    return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
  }
}
