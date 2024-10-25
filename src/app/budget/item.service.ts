import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateItem, EditIem, Item, ItemStatus } from './models/item';
import { ENV_CONFIG } from '../env.config';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  // change to use envConfig
  private envConfig = inject(ENV_CONFIG);
  readonly URL = 'http://localhost:3000/items';
  private httpClient = inject(HttpClient);

  constructor() {}

  list(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(this.URL);
  }

  get(id: number) {
    return this.httpClient.get<Item>(`${this.URL}/${id}`);
  }

  add(item: CreateItem) {
    console.log('CreateItem : ', item)
    return this.httpClient.post<Item>(this.URL, item);
  }

  edit(id: number, item: EditIem) {
    return this.httpClient.patch<Item>(`${this.URL}/${id}`, item);
  }

  delete(id: number) {
    return this.httpClient.delete<void>(`${this.URL}/${id}`);
  }

  // TODO: temp update by front-end
  // approve(id: number) {
  //   return this.httpClient.patch<Item>(`${this.URL}/${id}`, { status: ItemStatus.APPROVED });
  // }

  // reject(id: number) {
  //   return this.httpClient.patch<Item>(`${this.URL}/${id}`, { status: ItemStatus.REJECTED });
  // }

  approve(id: number) {
    return this.httpClient.patch<Item>(`${this.URL}/${id}/approve`, {}); // Adjust this if a specific endpoint exists
  }
  
  reject(id: number) {
    return this.httpClient.patch<Item>(`${this.URL}/${id}/reject`, {}); // Adjust this if a specific endpoint exists
  }
}
