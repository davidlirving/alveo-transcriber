import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AlveoService } from '../shared/alveo.service';

@Component({
  selector: 'dataview',
  templateUrl: './dataview.component.html',
  styleUrls: ['./dataview.component.css'],
})

export class DataViewComponent {
  @Input() items: any;
  selected: any;

  constructor(
    public router: Router,
    public alveoService: AlveoService) { }

  private getList(): any {
    return this.alveoService.getActiveList();
  }

  private getData(): any {
    return this.alveoService.getActiveListData(); // If it doesn't exist, it will be pulled
  }

  getListName(): any {
    let list = this.getList();
    if (list == null) {
      return "(Loading)"
    }
    return list.name;
  }

  getListSize(): any {
    let list = this.getList();
    if (list == null) {
      return "(...)"
    }
    return list.num_items;
  }

  getItems(): any {
    let list = this.getList();
    if (list == null) {
      return []
    }
    
    let items = [];
    for (let item of this.getData()) {
      items.push(item);
    }
    return items;
  }

  getDocs(): any {
    if (this.selected == null) {
      return [];
    }

    let pulledData = this.alveoService.getListItemData(this.selected).data['alveo:documents'];
    if (pulledData == undefined) { return [] }
    
    let items = [];
    for (let item of pulledData) {
      if (item['type'] == 'audio') {
        items.push(item);
      }
    }
    return items;
  }

  actionBack(): void {
    this.router.navigate(['./itemlists']);
  }

  onItemSelection(item: any): void {
    this.selected = item;
  }
}