import Papa from 'papaparse';
import type { IInvoice, IDashboardStats, IProjectSummary, IBudgetCodeSummary } from '@/models/invoice';
import { CsvFieldsKeysEnum } from '@/enums/csvFieldsKeys';
import { HttpService } from './http';

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

export class InvoiceDataService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  private parseAmount(amountStr: string): number {
    if (!amountStr || amountStr.trim() === '') return 0;
    // Remove commas, spaces, and any non-numeric characters except decimal points
    const cleanAmount = amountStr.replace(/[,\s]/g, '').replace(/[^\d.-]/g, '');
    return parseFloat(cleanAmount) || 0;
  }

  public async loadInvoiceData(): Promise<IInvoice[]> {
    try {
      const { data: csvText } = await this.httpService.httpInstance.get('/src/mocks/data.csv', { responseType: 'text' });

      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              const invoices: IInvoice[] = (results.data as CsvRow[]).map((row: CsvRow) => {
                const paymentAmount = this.parseAmount(row[CsvFieldsKeysEnum.PaymentAmount]);
                
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

  public calculateDashboardStats(invoices: IInvoice[]): IDashboardStats {
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(inv => inv.isPaid).length;
    const totalInvoiceAmount = invoices.reduce((sum, inv) => sum + inv.invoiceAmount, 0);
    const totalPaidAmount = invoices.reduce((sum, inv) => sum + (inv.paymentAmount || 0), 0);
    const totalOwed = totalInvoiceAmount - totalPaidAmount;
    const collectionRate = totalInvoiceAmount > 0 ? (totalPaidAmount / totalInvoiceAmount) * 100 : 0;

    // Group by project
    const projectMap = new Map<string, IProjectSummary>();
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
    const budgetCodeMap = new Map<string, IBudgetCodeSummary>();
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
      collectionRate,
      projectSummaries: Array.from(projectMap.values()).sort((a, b) => b.totalInvoiced - a.totalInvoiced),
      budgetCodeSummaries: Array.from(budgetCodeMap.values()).sort((a, b) => b.totalInvoiced - a.totalInvoiced),
    };
  }
}