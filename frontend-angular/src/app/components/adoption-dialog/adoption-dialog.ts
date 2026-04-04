import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Animal } from '../../models/animal';

export interface AdoptionDialogResult {
  customName: string;
  phone: string;
}

@Component({
  selector: 'app-adoption-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './adoption-dialog.html',
  styleUrl: './adoption-dialog.css'
})
export class AdoptionDialogComponent {
  readonly animal = inject<Animal>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AdoptionDialogComponent, AdoptionDialogResult>);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    customName: [this.animal.name],
    phone: ['', Validators.required]
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      customName: this.form.value.customName?.trim() ?? '',
      phone: this.form.value.phone?.trim() ?? ''
    });
  }
}
