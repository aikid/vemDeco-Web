export interface Estado {
    id: number;
    nome: string;
    sigla: string;
}
  
export interface Cidade {
    id: number;
    nome: string;
}

export interface UserData {
    name: string;
    email: string;
    phone: string;
    tipoPessoa: string;
    document: string;
    password: string;
    confirmPassword: string;
}