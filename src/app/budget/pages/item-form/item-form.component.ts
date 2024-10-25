import { DecimalPipe, JsonPipe, Location } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CanComponentDeactivate } from '../../../auth/guards/can-deactivate.guard';
import { ItemService } from '../../item.service';
import { ItemStatus } from '../../models/item';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { maxDecimalPlacesValidator } from './maxDecimalPlacesValidator';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, DecimalPipe],
  providers: [DecimalPipe], // Add DecimalPipe here
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.scss'
})
export class ItemFormComponent implements OnInit, CanComponentDeactivate {
  // add
  @Input()
  id: number | null = null;

  location = inject(Location);
  fb = inject(NonNullableFormBuilder);
  itemService = inject(ItemService);
  decimalPipe = inject(DecimalPipe);

  // formControls
  title = this.fb.control<string>('', { validators: Validators.required });
  contactMobileNo = this.fb.control<string>('', { validators: Validators.required });
  amount = this.fb.control<number | null>(null, {
    validators: [Validators.required, Validators.min(1), maxDecimalPlacesValidator(4)]
  });
  price = this.fb.control<number | null>(null, {
    validators: [Validators.required, Validators.min(0.5)]
  });

  // formGroup
  fg = this.fb.group({
    title: this.title,
    contactMobileNo: this.contactMobileNo,
    amount: this.amount,
    price: this.price
  });

  // add
  modalService = inject(BsModalService);
  bsModalRef?: BsModalRef;

  ngOnInit() {
    console.log('id', this.id) // ???
    if (this.id) {
      this.itemService.get(this.id).subscribe(v => this.fg.patchValue(v))
    }
  }

  // constructor() {
  //   console.log('id', this.id); // ???
  //   if (this.id) {
  //     this.itemService.get(this.id).subscribe((v) => this.fg.patchValue(v));
  //   }
  // }

  onBack(): void {
    this.location.back();
  }

  snackBar = inject(MatSnackBar);

  onSubmit(): void {
    const { status, ...item } = { ...this.fg.getRawValue(), status: ItemStatus.PENDING };
    console.log('Item with status (for logging only):', item);
  
    if (this.id) {
      console.log('In edit');
      this.itemService.edit(this.id, item).subscribe(() => {
        this.fg.markAsPristine(); // Mark the form as pristine after successful edit
        this.snackBar.open('Item updated successfully', 'Close', {
          duration: 3000, // Duration in milliseconds
        });
        this.onBack();
      });
    } else {
      console.log('In add');
      this.itemService.add(item).subscribe(() => {
        this.fg.markAsPristine(); // Mark the form as pristine after successful add
        this.snackBar.open('Item added successfully', 'Close', {
          duration: 3000,
        });
        this.onBack();
      });
    }
  }

  canDeactivate(): boolean | Observable<boolean> {
    // check is dirty-form
    const isFormDirty = this.fg.dirty
    console.log('isFormDirty', isFormDirty)
    if (!isFormDirty) {
      return true;
    }

    // init comfirm modal
    const initialState: ModalOptions = {
      initialState: {
        title: `Confirm to leave" ?`
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, initialState);

    return new Observable<boolean>((observer) => {
      this.bsModalRef?.onHidden?.subscribe(() => {
        observer.next(this.bsModalRef?.content?.confirmed);
        observer.complete()
      })  
    })
  }

  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    // Allow only numbers and a single decimal point
    if (value.match(/^\d*\.?\d*$/)) {
      // Trim to 4 decimal places if a decimal is present
      const [integerPart, decimalPart] = value.split('.');
      if (decimalPart && decimalPart.length > 4) {
        value = `${integerPart}.${decimalPart.substring(0, 4)}`;
      }
  
      // Parse the value to a number, or use null if the value is empty
      const parsedValue = value ? parseFloat(value) : null;
  
      // Update the form control with the sanitized value
      this.amount.setValue(parsedValue, { emitEvent: false });
    } else {
      // Revert to the previous valid value if the input is invalid
      input.value = this.amount.value ? this.amount.value.toString() : '';
    }
  }
}
