import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'listtable',
  templateUrl: './listtable.component.html',
  styleUrls: ['./listtable.component.css'],
})

export class ListTableComponent {
  @Input() tableData: any;
  @Output() onSelection = new EventEmitter<any>();

  public displayedColumns = ['listName', 'items', 'shared'];
  public dataSource = new MatTableDataSource<Element>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Element>(this.tableData);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); // MatTable filters by lowercase
    this.dataSource.filter = filterValue;
  }

  public onSelect(item): void {
    this.onSelection.emit(item);
  }

  public getDataCount(): number {
    if (this.tableData !== null) {
      return this.tableData.length;
    }
    return 0;
  }
}
