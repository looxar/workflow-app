import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { map } from 'rxjs';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { MobileFormatPipe } from '../../../shared/pipes/mobile-format.pipe';
import { ItemService } from '../../item.service';
import { Item } from '../../models/item';
import { AuthService } from '../../../auth/auth.service';
import { Role } from '../../../auth/models/logged-in-user';

@Component({
  selector: 'app-item-entry',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MobileFormatPipe, DecimalPipe, RouterLink, CommonModule], // add RouterLink
  templateUrl: './item-entry.component.html',
  styleUrl: './item-entry.component.scss'
})
export class ItemEntryComponent {
  isSmallTable = false;

  // httpClient = inject(HttpClient)
  itemService = inject(ItemService);
  authService = inject(AuthService);

  items: Item[] = [];
  filterItems = this.items;
  filterInput = new FormControl<string>('', { nonNullable: true });

  modalService = inject(BsModalService);
  bsModalRef?: BsModalRef;

  constructor() {
    this.itemService.list().subscribe((vs) => {
      this.items = vs.sort((a, b) => a.id - b.id); // Sort items by id in ascending order
      this.filterItems = this.items;
    });

    this.filterInput.valueChanges // ดักเหตุการณ์ที่ value เปลี่ยนได้
      .pipe(map((keyword) => keyword.toLocaleLowerCase())) // convert value ได้
      .subscribe((keyword) => {
        console.log('keyword', keyword);
        this.filterItems = this.items.filter((item) =>
          item.title.toLocaleLowerCase().includes(keyword)
        ); // เขียน logic จากการเปลี่ยน value ได้
      });
  }

  onConfirm(item: Item) {
    const initialState: ModalOptions = {
      initialState: {
        title: `Confirm to delete "${item.title}" ?`
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, initialState);
    this.bsModalRef?.onHidden?.subscribe(() => {
      if (this.bsModalRef?.content?.confirmed) {
        this.onDelete(item.id);
      }
    });
  }

  onDelete(id: number) {
    this.itemService
      .delete(id)
      .subscribe(() => (this.filterItems = this.filterItems.filter((v) => v.id != id)));
  }

  isAdminOrManager(): boolean {
    const loggedInUser = this.authService.loggedInUser;
    return loggedInUser?.userProfile.role === Role.ADMIN || loggedInUser?.userProfile.role === Role.MANAGER;
  }

  trackById(index: number, item: Item): number {
    return item.id;
  }
}
