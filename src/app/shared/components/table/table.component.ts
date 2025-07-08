import {
  Component,
  effect,
  input,
  output,
  signal,
  WritableSignal,
  computed,
} from '@angular/core';
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/table-core';
import { createAngularTable } from '@tanstack/angular-table';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent<T extends object> {
  // ✅ Input signals
  data = input<T[]>([]);
  columns = input<ColumnDef<T>[]>([]);
  enableSorting = input<boolean>(true);
  enableSelection = input<boolean>(false);

  // ✅ Output signal for parent to observe selected rows
  selectedData = output<T[]>();

  // Internal signal for selected row IDs
  selectedRowIds = signal<Set<string>>(new Set());

  // Create the table using signal-based API
  table = createAngularTable(() => ({
    data: this.data(),
    columns: this.columns(),
    getCoreRowModel: getCoreRowModel(),
    ...(this.enableSorting() && { getSortedRowModel: getSortedRowModel() }),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row: any, index) => row?.id ?? `${index}`,
  }));

  // Computed selected rows
  selectedRows = computed(() =>
    this.table
      .getRowModel()
      .rows.filter((row) => this.selectedRowIds().has(row.id))
      .map((row) => row.original)
  );

  constructor() {
    // Emit selected data to parent
    effect(() => {
      if (this.enableSelection()) {
        this.selectedData.emit(this.selectedRows());
      } else {
        this.selectedData.emit([]);
      }
    });
  }

  toggleAllRows() {
    if (!this.enableSelection()) return;

    const allRows = this.table.getRowModel().rows;
    const allSelected = this.selectedRowIds().size === allRows.length;
    const updated = new Set<string>();

    if (!allSelected) {
      allRows.forEach((row) => updated.add(row.id));
    }

    this.selectedRowIds.set(updated);
  }

  toggleRow(rowId: string) {
    if (!this.enableSelection()) return;

    const current = new Set(this.selectedRowIds());
    current.has(rowId) ? current.delete(rowId) : current.add(rowId);
    this.selectedRowIds.set(current);
  }
}
