import Papa from 'papaparse';
import type { Invoice, DashboardStats, ProjectSummary, BudgetCodeSummary } from '@/models/invoice';
import { CsvFieldsKeysEnum } from '@/enums/csvFieldsKeys';

interface CsvRow {
  [CsvFieldsKeysEnum.PurchaseOrderNumber]: string;
  [CsvFieldsKeysEnum.BudgetCode]: string;
  [CsvFieldsKeysEnum.BudgetAmount]: string;
  [CsvFieldsKeysEnum.ProjectName]: string;
  [CsvFieldsKeysEnum.InvoiceNumber]: string;
  [CsvFieldsKeysEnum.InvoiceDate]: string;
  [CsvFieldsKeysEnum.InvoiceAmount]: string;
  [CsvFieldsKeysEnum.PaymentAmount]: string;
}

export class DataService {
  private static parseAmount(amountStr: string): number {
    if (!amountStr || amountStr.trim() === '') return 0;
    // Remove commas, spaces, and any non-numeric characters except decimal points
    const cleanAmount = amountStr.replace(/[,\s]/g, '').replace(/[^\d.-]/g, '');
    return parseFloat(cleanAmount) || 0;
  }

  public static async loadInvoiceData(): Promise<Invoice[]> {
    try {
      const response = await fetch('/src/mocks/data.csv');
      const csvText = await response.text();

      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              const invoices: Invoice[] = (results.data as CsvRow[]).map((row: CsvRow) => {
                const paymentAmount = this.parseAmount(row[CsvFieldsKeysEnum.PaymentAmount]);
                console.log(row, row[CsvFieldsKeysEnum.PaymentAmount], paymentAmount);
                
                return {
                  purchaseOrderNumber: row[CsvFieldsKeysEnum.PurchaseOrderNumber]?.trim() || '',
                  budgetCode: row[CsvFieldsKeysEnum.BudgetCode]?.trim() || '',
                  budgetAmount: this.parseAmount(row[CsvFieldsKeysEnum.BudgetAmount]),
                  projectName: row[CsvFieldsKeysEnum.ProjectName]?.trim() || '',
                  invoiceNumber: row[CsvFieldsKeysEnum.InvoiceNumber]?.trim() || '',
                  invoiceDate: row[CsvFieldsKeysEnum.InvoiceDate],
                  invoiceAmount: this.parseAmount(row[CsvFieldsKeysEnum.InvoiceAmount]),
                  paymentAmount: paymentAmount > 0 ? paymentAmount : null,
                  isPaid: paymentAmount > 0,
                };
              }).filter(invoice => invoice.invoiceNumber);
              
              resolve(invoices);
            } catch (error) {
              reject(error);
            }
          },
          error: (error: Error) => {
            reject(error);
          },
        });
      });
    } catch (error) {
      console.error('Error loading invoice data:', error);
      throw error;
    }
  }

  public static calculateDashboardStats(invoices: Invoice[]): DashboardStats {
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(inv => inv.isPaid).length;
    const totalInvoiceAmount = invoices.reduce((sum, inv) => sum + inv.invoiceAmount, 0);
    const totalPaidAmount = invoices.reduce((sum, inv) => sum + (inv.paymentAmount || 0), 0);
    const totalOwed = totalInvoiceAmount - totalPaidAmount;

    // Group by project
    const projectMap = new Map<string, ProjectSummary>();
    invoices.forEach(invoice => {
      const existing = projectMap.get(invoice.projectName) || {
        projectName: invoice.projectName,
        totalInvoiced: 0,
        totalPaid: 0,
        invoiceCount: 0,
      };

      existing.totalInvoiced += invoice.invoiceAmount;
      existing.totalPaid += invoice.paymentAmount || 0;
      existing.invoiceCount += 1;

      projectMap.set(invoice.projectName, existing);
    });

    // Group by budget code
    const budgetCodeMap = new Map<string, BudgetCodeSummary>();
    invoices.forEach(invoice => {
      const existing = budgetCodeMap.get(invoice.budgetCode) || {
        budgetCode: invoice.budgetCode,
        totalInvoiced: 0,
        totalPaid: 0,
        invoiceCount: 0,
      };

      existing.totalInvoiced += invoice.invoiceAmount;
      existing.totalPaid += invoice.paymentAmount || 0;
      existing.invoiceCount += 1;
      
      budgetCodeMap.set(invoice.budgetCode, existing);
    });
    
    return {
      totalInvoices,
      paidInvoices,
      totalInvoiceAmount,
      totalPaidAmount,
      totalOwed,
      projectSummaries: Array.from(projectMap.values()).sort((a, b) => b.totalInvoiced - a.totalInvoiced),
      budgetCodeSummaries: Array.from(budgetCodeMap.values()).sort((a, b) => b.totalInvoiced - a.totalInvoiced),
    };
  }
}