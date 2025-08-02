export interface Invoice {
  purchaseOrderNumber: string;
  budgetCode: string;
  budgetAmount: number;
  projectName: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;
  paymentAmount: number | null;
  isPaid: boolean;
}

export interface ProjectSummary {
  projectName: string;
  totalInvoiced: number;
  totalPaid: number;
  invoiceCount: number;
}

export interface BudgetCodeSummary {
  budgetCode: string;
  totalInvoiced: number;
  totalPaid: number;
  invoiceCount: number;
}

export interface DashboardStats {
  totalInvoices: number;
  paidInvoices: number;
  totalInvoiceAmount: number;
  totalPaidAmount: number;
  totalOwed: number;
  projectSummaries: ProjectSummary[];
  budgetCodeSummaries: BudgetCodeSummary[];
}

export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
}

export interface CurrencyResponse {
  success: boolean;
  base: string;
  date: string;
  rates: Record<string, number>;
}