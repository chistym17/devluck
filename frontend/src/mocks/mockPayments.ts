export type PaymentStatus = "Upcoming" | "Paid";

export interface Payment {
  id: number;
  contractId: number; // reference to the contract
  nextPayment: string; // e.g., "2025-01-15"
  paymentId: string;   // unique payment transaction ID
  status: PaymentStatus;
}

export const mockPayments: Payment[] = [
  // Payments for contract 1
  { id: 1, contractId: 1, nextPayment: "2024-02-10", paymentId: "PAY-1001", status: "Paid" },
  { id: 2, contractId: 1, nextPayment: "2024-03-10", paymentId: "PAY-1002", status: "Upcoming" },
  { id: 3, contractId: 1, nextPayment: "2024-04-10", paymentId: "PAY-1003", status: "Upcoming" },
  { id: 4, contractId: 1, nextPayment: "2024-05-10", paymentId: "PAY-1004", status: "Upcoming" },
  { id: 5, contractId: 1, nextPayment: "2024-06-10", paymentId: "PAY-1005", status: "Upcoming" },
  { id: 6, contractId: 1, nextPayment: "2024-07-10", paymentId: "PAY-1006", status: "Upcoming" },
  { id: 7, contractId: 1, nextPayment: "2024-08-10", paymentId: "PAY-1007", status: "Upcoming" },
  { id: 8, contractId: 1, nextPayment: "2024-09-10", paymentId: "PAY-1008", status: "Upcoming" },
  { id: 9, contractId: 1, nextPayment: "2024-10-10", paymentId: "PAY-1009", status: "Upcoming" },


  // Payments for contract 2
  { id: 4, contractId: 2, nextPayment: "2024-01-01", paymentId: "PAY-2001", status: "Paid" },
  { id: 5, contractId: 2, nextPayment: "2024-02-01", paymentId: "PAY-2002", status: "Paid" },

  // Payments for contract 3
  { id: 6, contractId: 3, nextPayment: "2024-03-01", paymentId: "PAY-3001", status: "Upcoming" },
  { id: 7, contractId: 3, nextPayment: "2024-04-01", paymentId: "PAY-3002", status: "Upcoming" },

  // Payments for contract 4
  { id: 8, contractId: 4, nextPayment: "2023-10-15", paymentId: "PAY-4001", status: "Paid" },
  { id: 9, contractId: 4, nextPayment: "2023-11-15", paymentId: "PAY-4002", status: "Paid" },
  { id: 10, contractId: 4, nextPayment: "2023-12-15", paymentId: "PAY-4003", status: "Upcoming" },

  // Payments for contract 5
  { id: 11, contractId: 5, nextPayment: "2024-04-01", paymentId: "PAY-5001", status: "Upcoming" },
  { id: 12, contractId: 5, nextPayment: "2024-05-01", paymentId: "PAY-5002", status: "Upcoming" },
];
