import { Component, Input, EventEmitter, Output, input, OnInit, output } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Activity } from 'src/app/core/models/generic';


@Component({
  selector: 'app-payment-details',
  imports: [NzModalModule],
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css'
})
export class PaymentDetailsComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() activity: Activity = {} as Activity;
  radioValue = 'A';

  @Output() handleClose = new EventEmitter();

  constructor() {}

  ngOnInit() {}
  handleCancel() {
    this.handleClose.emit();
  }

}
