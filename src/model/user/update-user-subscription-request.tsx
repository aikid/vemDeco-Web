export interface IUpdateUserSubscriptionRequest {
    planId:string,
}

export interface IBindUserSubscriptionRequest {
    userId: string,
    name: string,
    email: string
}