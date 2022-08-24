import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { filter } from "rxjs/operators";
import { IPaymentMethodsDialogDataParams, MatCommercePayMethodsDialogComponent } from "../../components/pay-methods-dialog/mat-commerce-pay-methods-dialog.component";

@Injectable()
export class MatCommercePayMethodsDialogService {

  constructor(
    private matDialog: MatDialog
  ) { }

  OnOpen(dialogdata: IPaymentMethodsDialogDataParams) {
    const dialogRef = this.matDialog.open(MatCommercePayMethodsDialogComponent, { disableClose: true, data: dialogdata })
    return dialogRef.afterClosed().pipe(filter(x => !!x));
  }

}
