import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject, catchError, combineLatest, debounceTime, distinctUntilChanged, map, of, shareReplay, startWith, switchMap, take } from 'rxjs';
import { Animal } from '../../models/animal';
import { AdoptionStateService } from '../../services/adoption-state';
import { ZooDataService } from '../../services/zoo-data';
import { AdoptionDialogComponent } from '../adoption-dialog/adoption-dialog';

// Animal Exhibit component
@Component({
  selector: 'app-animal-exhibit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './animal-exhibit.html',
  styleUrl: './animal-exhibit.css'
})
export class AnimalExhibit {
  private readonly zooData = inject(ZooDataService);
  private readonly adoption = inject(AdoptionStateService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private readonly refreshAnimals$ = new BehaviorSubject<void>(void 0);

  // Animals
  readonly animals$ = this.refreshAnimals$.pipe(
    switchMap(() =>
      this.zooData.getAnimals().pipe(
        map((animals) => {
          this.loadError.set('');
          return animals;
        }),
        catchError(() => {
          this.loadError.set('Could not load animals.');
          return of<Animal[]>([]);
        })
      )
    ),
    shareReplay(1)
  );
  animals = toSignal(this.animals$, { initialValue: [] });
  // Selected name
  selectedName = signal('');
  // Load error
  loadError = signal('');
  // Search control
  readonly searchControl = this.fb.control('', { nonNullable: true });

  // Selected animal
  readonly selectedAnimal = computed(() => this.animals().find((a) => a.name === this.selectedName()) ?? null);
  // Adopted records
  readonly adoptedRecords = this.adoption.records;
  // Search results
  readonly searchResults = toSignal(
    combineLatest([
      toObservable(this.animals),
      this.searchControl.valueChanges.pipe(
        startWith(this.searchControl.value),
        debounceTime(200),
        map((query) => query.trim().toLowerCase()),
        distinctUntilChanged()
      )
    ]).pipe(
      map(([animals, query]) => {
        if (!query) return [];
        return animals.filter((a) =>
          [a.name, a.type, a.habitat, a.conservationStatus].some((v) => String(v ?? '').toLowerCase().includes(query))
        );
      })
    ),
    { initialValue: [] }
  );

  // Add animal form
  readonly addAnimalForm = this.fb.group({
    species: ['', [Validators.required, Validators.minLength(2)]],
    class: ['', [Validators.required, Validators.minLength(2)]],
    conservationStatus: ['', Validators.required],
    habitat: ['', [Validators.required, Validators.minLength(2)]],
    img: [''],
    description: ['', [Validators.required, Validators.minLength(10)]],
    more: ['']
  });

  // Load animals
  loadAnimals(): void {
    this.refreshAnimals$.next();
  }

  // Pick animal
  pickAnimal(name: string): void {
    this.selectedName.set(name);
  }

  // Open adoption
  openAdoption(animal: Animal): void {
    this.dialog
      .open(AdoptionDialogComponent, {
        width: '420px',
        data: animal
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: { customName: string; phone: string } | undefined) => {
        if (!result) return;
        this.adoption.adopt(animal.name, result.phone, result.customName);
        this.snackBar.open(`${this.adoption.displayName(animal.name)} adopted successfully!`, 'Close', {
          duration: 3000
        });
      });
  }

  // Remove adoption
  removeAdoption(displayName: string): void {
    this.adoption.removeByDisplayName(displayName);
  }

  // Is adopted
  isAdopted(name: string): boolean {
    return this.adoption.isAdopted(name);
  }

  // Display name
  displayName(name: string): string {
    return this.adoption.displayName(name);
  }

  // Contact for
  contactFor(displayName: string): string {
    return this.adoption.contactByDisplayName(displayName);
  }

  // Submit animal
  submitAnimal(): void {
    if (this.addAnimalForm.invalid) {
      this.addAnimalForm.markAllAsTouched();
      return;
    }

    // Get form values
    const v = this.addAnimalForm.getRawValue();
    const payload: Animal = {
      name: (v.species ?? '').trim(),
      type: (v.class ?? '').trim(),
      conservationStatus: (v.conservationStatus ?? '').trim(),
      habitat: (v.habitat ?? '').trim(),
      description: (v.description ?? '').trim(),
      image: (v.img ?? '').trim() || 'images/comingSoon.png',
      funFact: (v.more ?? '').trim() || undefined
    };

    // Create animal
    this.zooData
      .createAnimal(payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadAnimals();
          this.snackBar.open('Animal added to the zoo!', 'Close', {
            duration: 3000
          });
          this.addAnimalForm.reset({ species: '', class: '', conservationStatus: '', habitat: '', img: '', description: '', more: '' });
        },
        // Error
        error: () => {
          this.snackBar.open('Error: could not save animal.', 'Close', {
            duration: 4000
          });
        }
      });
  }
}
