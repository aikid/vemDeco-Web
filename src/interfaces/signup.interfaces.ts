export interface ISignUpData {
    name: string;
    email: string;
    phone: string;
    tipoPessoa: string;
    document: string;
    password: string;
    confirmPassword: string;
}

export interface LoginResponse {
    type: string;
    token: string;
    username: string;
    subscription: SubscriptionData;
}

export interface SubscriptionData {
    status?: boolean;
    limit?: number;
    subscriptionId?: string;
    planId?: string;
    isTrial: boolean;
}