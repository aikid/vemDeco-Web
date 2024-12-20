export interface Estado {
    _id: number;
    nome: string;
    sigla: string;
}
export interface UserData {
    _id?: string;
    type?: string;
    occupation?: string;
    createdAt?: string;
    gatewayCustomerId?: string;
    name: string;
    email: string;
    phone: string;
    tipoPessoa: string;
    document: string;
    password: string;
    confirmPassword: string;
    city: string;
    state:string;
}

export interface AddressData {
    cep: string;
    logradouro: string;
    complemento: string;
    unidade: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
}