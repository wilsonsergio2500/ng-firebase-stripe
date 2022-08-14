import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { filter } from "rxjs/operators";
import { MatCommercePayMethodsDialogComponent } from "../../components/pay-methods-dialog/mat-commerce-pay-methods-dialog.component";

@Injectable()
export class MatCommercePayMethodsDialogService {

  constructor(
    private matDialog: MatDialog
  ) { }

  OnOpen() {
    const dialogRef = this.matDialog.open(MatCommercePayMethodsDialogComponent, { disableClose: true })
    return dialogRef.afterClosed().pipe(filter(x => !!x));
  }

}
