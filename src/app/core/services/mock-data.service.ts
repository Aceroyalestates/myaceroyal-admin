import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  getSystemActivities(): Observable<any[]> {
    return of([
      { id: 1, user_name: 'John Admin', user_role: 'Admin', action: 'Property Created', details: 'Created new property: Lagos Luxury Apartment', date: '2024-12-09 10:30 AM', status: 'Completed' },
      { id: 2, user_name: 'Sarah Realtor', user_role: 'Realtor', action: 'Client Meeting', details: 'Met with potential buyer for Property #123', date: '2024-12-09 02:15 PM', status: 'Completed' },
      { id: 3, user_name: 'Mike User', user_role: 'User', action: 'Profile Updated', details: 'Updated contact information and preferences', date: '2024-12-09 04:45 PM', status: 'Completed' },
      { id: 4, user_name: 'Admin System', user_role: 'Admin', action: 'Report Generated', details: 'Generated monthly revenue report', date: '2024-12-09 06:00 PM', status: 'Completed' },
      { id: 5, user_name: 'Jane Realtor', user_role: 'Realtor', action: 'Property Updated', details: 'Updated pricing for Property #456', date: '2024-12-09 08:20 PM', status: 'Completed' },
    ]);
  }

  getCustomerActivities(): Observable<any[]> {
    return of([
      { id: 1, customer_name: 'Alice Johnson', activity_type: 'Account Created', description: 'New customer registration completed', date: '2024-12-09 09:15 AM', status: 'Active' },
      { id: 2, customer_name: 'Bob Williams', activity_type: 'Subscription Form', description: 'Filled premium subscription form', date: '2024-12-09 11:30 AM', status: 'Pending' },
      { id: 3, customer_name: 'Carol Davis', activity_type: 'Payment Made', description: 'Payment of ₦50,000 for property consultation', date: '2024-12-09 01:45 PM', status: 'Completed' },
      { id: 4, customer_name: 'David Brown', activity_type: 'Property Viewed', description: 'Viewed Lagos Luxury Apartment details', date: '2024-12-09 03:20 PM', status: 'Active' },
      { id: 5, customer_name: 'Emma Wilson', activity_type: 'Inquiry Sent', description: 'Sent inquiry about Abuja property pricing', date: '2024-12-09 05:30 PM', status: 'Pending' },
      { id: 6, customer_name: 'Frank Miller', activity_type: 'Payment Made', description: 'Payment of ₦2,500,000 for property purchase', date: '2024-12-09 07:10 PM', status: 'Completed' },
    ]);
  }
}

