export interface IInvoice {
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

export interface IProjectSummary {
  projectName: string;
  totalInvoiced: number;
  totalPaid: number;
  invoiceCount: number;
}

export interface IBudgetCodeSummary {
  budgetCode: string;
  totalInvoiced: number;
  totalPaid: number;
  invoiceCount: number;
}

export interface IDashboardStats {
  totalInvoices: number;
  paidInvoices: number;
  totalInvoiceAmount: number;
  totalPaidAmount: number;
  totalOwed: number;
  projectSummaries: IProjectSummary[];
  budgetCodeSummaries: IBudgetCodeSummary[];
}

export interface ICurrencyRate {
  code: string;
  name: string;
  rate: number;
}

export interface ICurrencyResponse {
  success: boolean;
  base: string;
  date: string;
  rates: Record<string, number>;
}