export interface IUpdateUserSubscriptionRequest {
    planId:string,
}

export interface IBindUserSubscriptionRequest {
    userId: string,
    name: string,
    email: string
}

export interface IUserResponse {
    _id: string
    name: string,
    email: string,
    userId: string,
}

export interface IUserSubscriptionResponse {
    _id: string,
    ownerId: string,
    planId: string,
    status: string,
    dataStart: string,
    dataEnd: string,
    dueDate: string,
    nextDueDate: string,
    gatewaySubscripitionId: string,
    shouldCancel: boolean,
    paymentStatus: boolean,
    users: IUserResponse
}