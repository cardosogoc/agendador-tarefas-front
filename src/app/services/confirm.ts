import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../shared/components/confirm-dialog/confirm-dialog';

@Injectable({ providedIn: 'root' })
export class Confirm {
  private dialog = inject(MatDialog);

  ask(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog
      .open(ConfirmDialog, { data, width: '400px' })
      .afterClosed()
      .pipe(map((result) => result === true));
  }
}
