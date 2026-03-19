import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Animal } from '../../models/animal';
import { AdoptionStateService } from '../../services/adoption-state';
import { ZooDataService } from '../../services/zoo-data';

// Animal Exhibit component
@Component({
  selector: 'app-animal-exhibit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './animal-exhibit.html',
  styleUrl: './animal-exhibit.css'
})
export class AnimalExhibit implements OnInit {
  private readonly zooData = inject(ZooDataService);
  private readonly adoption = inject(AdoptionStateService);
  private readonly fb = inject(FormBuilder);

  // Animals
  animals = signal<Animal[]>([]);
  // Selected name
  selectedName = signal('');
  // Search query
  searchQuery = signal('');
  // Load error
  loadError = signal('');
  // Form message
  formMessage = signal('');

  // Adoption open
  adoptionOpen = signal(false);
  // Adoption target
  adoptionTarget = signal<Animal | null>(null);

  // Selected animal
  readonly selectedAnimal = computed(() => this.animals().find((a) => a.name === this.selectedName()) ?? null);
  // Adopted records
  readonly adoptedRecords = this.adoption.records;
  // Search results
  readonly searchResults = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return [];
    return this.animals().filter((a) => [a.name, a.type, a.habitat, a.conservationStatus].some((v) => String(v ?? '').toLowerCase().includes(q)));
  });

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

  // Adopt form
  readonly adoptForm = this.fb.group({
    customName: [''],
    phone: ['', Validators.required]
  });

  // On init
  ngOnInit(): void {
    this.loadAnimals();
  }

  // Load animals
  loadAnimals(): void {
    this.zooData.getAnimals().subscribe({
      next: (animals) => {
        this.animals.set(animals);
        this.loadError.set('');
      },
      error: () => {
        this.loadError.set('Could not load animals.');
      }
    });
  }

  // Pick animal
  pickAnimal(name: string): void {
    this.selectedName.set(name);
  }

  // Open adoption
  openAdoption(animal: Animal): void {
    this.adoptionTarget.set(animal);
    this.adoptForm.reset({ customName: animal.name, phone: '' });
    this.adoptionOpen.set(true);
  }

  // Close adoption
  closeAdoption(): void {
    this.adoptionOpen.set(false);
    this.adoptionTarget.set(null);
  }

  // Confirm adoption
  confirmAdoption(): void {
    if (this.adoptForm.invalid || !this.adoptionTarget()) {
      this.adoptForm.markAllAsTouched();
      return;
    }
    const target = this.adoptionTarget();
    if (!target) return;

    this.adoption.adopt(target.name, this.adoptForm.value.phone?.trim() ?? '', this.adoptForm.value.customName?.trim() ?? '');
    this.closeAdoption();
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
    this.zooData.createAnimal(payload).subscribe({
      next: (saved) => {
        this.animals.set([...this.animals(), saved]);
        this.formMessage.set('Animal added!');
        this.addAnimalForm.reset({ species: '', class: '', conservationStatus: '', habitat: '', img: '', description: '', more: '' });
        setTimeout(() => this.formMessage.set(''), 4000);
      },
      // Error
      error: () => {
        this.formMessage.set('Error: could not save animal.');
      }
    });
  }
}
