import { Component, inject, model, signal } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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

export interface DialogField {
  name: string;
  label: string;
  value?: string | number;
  button?: {
    icon: string;
    callback: (value: string, dialogRef: MatDialogRef<ModalDialog>) => void;
  };
  type?: string;
  validators?: any[];
}

interface DialogData {
  title: string;
  formConfig: DialogField[];
}

@Component({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    ReactiveFormsModule,
    MatIconModule,
  ],
  selector: 'app-modal-dialog',
  styleUrl: './modal-dialog.scss',
  templateUrl: './modal-dialog.html',
})
export class ModalDialog {
  readonly FormBuilder = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<ModalDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  fields: DialogField[] = this.data.formConfig;

  private buildControls(): Record<string, any> {
    const controls: Record<string, any> = {};

    this.fields.forEach((field) => {
      controls[field.name] = [field.value ?? '', field.validators || null];
    });
    return controls;
  }

  form: FormGroup = this.FormBuilder.group(this.buildControls());

  onSave() {
    this.dialogRef.close(this.form.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
