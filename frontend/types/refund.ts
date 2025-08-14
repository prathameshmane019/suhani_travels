
export interface IRefundRequest {
  _id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  amount: number;
  reason: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}
