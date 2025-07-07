import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { NzTableModule } from 'ng-zorro-antd/table';
@Component({
  selector: 'app-table',
  imports: [NzTableModule, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input() columns: { title: string; key: keyof any }[] = [];
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() pageSize: number = 10;
  @Input() total: number = 0;
  @Input() pageIndex: number = 1;
  @Input() showPagination: boolean = false;
}
