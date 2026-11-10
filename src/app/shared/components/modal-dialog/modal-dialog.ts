import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';

export interface DialogField {
  name: string;
  label: string;
  value?: string | number | Date;
  minDate?: Date;
  button?: {
    icon: string;
    callback: (value: string, dialogRef: MatDialogRef<ModalDialog>) => void;
  };
  type?: 'text' | 'number' | 'date' | 'time';
  validators?: ValidatorFn[];
}

interface DialogData {
  title: string;
  formConfig: DialogField[];
}

@Component({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatTimepickerModule,
  ],
  selector: 'app-modal-dialog',
  styleUrl: './modal-dialog.scss',
  templateUrl: './modal-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDialog {
  private formBuilder = inject(FormBuilder);
  readonly dialogRef = inject<MatDialogRef<ModalDialog>>(MatDialogRef);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly fields: DialogField[] = this.data.formConfig;

  readonly form: FormGroup = this.formBuilder.group(this.buildControls());

  private buildControls(): Record<string, any> {
    const controls: Record<string, any> = {};

    this.fields.forEach((field) => {
      controls[field.name] = [field.value ?? '', field.validators ?? null];
    });
    return controls;
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
