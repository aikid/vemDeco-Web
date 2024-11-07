

interface Completion{
    summary: string;
    prescription: string;
    certificate:string;
    json: string
    error: string;
}

interface Usage {
    input_tokens: number,
    output_tokens: number
}

interface TranscriptionData{
    success: boolean;
    usage: Usage;
    transcription: string;
    completion: Completion
}

export interface Transcription{
    resumes: any;
    _id: string;
    customer: string;
    link: string;
    data: TranscriptionData;
    expireDate: string;
    createdAt: string;
    updatedAt: string;
}
