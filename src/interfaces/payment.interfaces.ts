interface CreditCard{
    creditCardNumber: string;
    creditCardBrand:  string;
    creditCardToken:  string;
}

interface Discount{
    value: number;
    dueDateLimitDays: number;
    type: string;
}

interface Fine{
    value: number;
    type:  string;
}

interface Interest{
    value: number;
    type:  string;
}

export interface Payment{
    creditCard?: CreditCard;
    discount?: Discount;
    fine?: Fine;
    interest?: Interest;
    object?: string;
    id: string;
    dateCreated: string;
    customer?: string;
    subscription?: string;
    paymentLink?: string;
    dueDate: string;
    originalDueDate?: string;
    value: number;
    netValue?: number;
    originalValue?: number;
    interestValue?: number;
    nossoNumero?: string;
    description: string;
    externalReference?: string;
    billingType?: string;
    status: string;
    pixTransaction?: any;
    confirmedDate?: string;
    paymentDate?: any;
    clientPaymentDate?: string;
    installmentNumber?: any;
    creditDate?: string;
    custody?: any;
    estimatedCreditDate?: string;
    invoiceUrl?: string;
    bankSlipUrl?: string;
    transactionReceiptUrl?: string;
    invoiceNumber?: string;
    deleted?: boolean;
    anticipated?: boolean;
    anticipable?: boolean;
    lastInvoiceViewedDate?: string;
    lastBankSlipViewedDate?: any;
    postalService?: boolean;
    refunds?: any;
    split?: any;
}

export interface PaymentsData{
    payment: Payment;
    _id: string;
    id: string;
    event: string;
    dateCreated: string;
}