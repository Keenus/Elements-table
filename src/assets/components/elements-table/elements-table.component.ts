import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ELEMENT_DATA, PeriodicElement} from "../../../../../../18/elements-table/src/assets/data/elements";
import {
  MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatTabLabel} from "@angular/material/tabs";
import {CommonModule} from "@angular/common";
import {debounceTime, delay, distinctUntilChanged, exhaustAll, filter, Observable, Subject} from "rxjs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {toObservable} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-elements-table',
  standalone: true,
  imports: [
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCellDef,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatInput,
    MatTabLabel,
    CommonModule,
    MatLabel,
    ReactiveFormsModule,
    FormsModule,
    MatButton
  ],
  templateUrl: './elements-table.component.html',
  styleUrl: './elements-table.component.scss'
})
export class ElementsTableComponent implements OnInit {

  elements = signal<PeriodicElement[]>([])

  data: PeriodicElement[] = []
  searchSub$ = new Subject<string>()
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  constructor(
    public dialog: MatDialog
  ) {

    this.elements.set(this.getElements())
    let allData = toObservable<PeriodicElement[]>(this.elements).pipe(
      delay(2000)
    )
    allData.subscribe((data) => {
      this.data = data
    })

  }

  ngOnInit() {
    this.searchSub$.pipe(
      debounceTime(1200),
      distinctUntilChanged()
    ).subscribe((filterValue: string) => {
      this.filterData(filterValue)
    });
  }

  getElements(): PeriodicElement[] {
    return ELEMENT_DATA
  }

  applyFilter(event: string) {
    this.searchSub$.next(event)
  }

  filterData(value: string) {
    this.data = this.elements().filter(element => {
      return element.name.toLowerCase().includes(value.toLowerCase()) || element.symbol.toLowerCase().includes(value.toLowerCase()) || element.weight.toString().includes(value)
    })
  }

  openEdit(column: string, element: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { column: column, value: element[column] },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        element[column] = result;
      }
    });
  }
}
