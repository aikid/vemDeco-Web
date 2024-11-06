export interface IPromptRequest{
    prompt: string
}

export interface PromptData{
    _id: string
    prompt: string
    createdAt: string
    email: string
    default: boolean
}