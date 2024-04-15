export interface IUpdateUserProfileRequest {
    familyName: string,
    givenName: string,
    email: string,
    phoneNumber: string,
    whatsAppNumber: string,
    birthDate: undefined | string,
    document: string,
    sex: string
}