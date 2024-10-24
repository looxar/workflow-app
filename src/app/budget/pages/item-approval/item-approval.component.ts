import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MobileFormatPipe } from '../../../shared/pipes/mobile-format.pipe';
import { ItemService } from '../../item.service';
import { Item, ItemStatus } from '../../models/item';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

type ItemAction = 'Approve' | 'Reject';

@Component({
  selector: 'app-item-approval',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, MobileFormatPipe],
  templateUrl: './item-approval.component.html',
  styleUrl: './item-approval.component.scss'
})
export class ItemApprovalComponent {
  itemService = inject(ItemService);

  items: Item[] = [];

  modalService = inject(BsModalService);
  bsModalRef?: BsModalRef;

  readonly ItemStatus = ItemStatus;

  constructor() {
    this.itemService.list().subscribe((vs) => {
      this.items = vs;
    });
  }

  onConfirm(item: Item, itemAction: ItemAction) {
    const initialState: ModalOptions = {
      initialState: {
        title: `Confirm to ${itemAction} "${item.title}" ?`
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, initialState);
    this.bsModalRef?.onHidden?.subscribe(() => {
      if (this.bsModalRef?.content?.confirmed) {
        if (itemAction === 'Approve') {
          this.onApprove(item.id);
        }

        if (itemAction === 'Reject') {
          this.onReject(item.id);
        }
      }
    });
  }

  onApprove(id: number) {
    this.itemService.approve(id).subscribe(() => {
      this.items = this.items.map((v) => (v.id === id ? { ...v, status: ItemStatus.APPROVED } : v));
    });
  }

  onReject(id: number) {
    this.itemService.reject(id).subscribe(() => {
      this.items = this.items.map((v) => (v.id === id ? { ...v, status: ItemStatus.REJECTED } : v));
    });
  }

}
