import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class MatCommerceStripeCardDialogService {

  constructor(private readonly matDialog: MatDialog) {}
  
}
