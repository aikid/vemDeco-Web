const validarEmail = (email:string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

const validarTelephone = (phone:string): boolean => {
    const regex = /^\+\d{1,3}\s?\(?\d{1,4}\)?[\s-]?\d{4,10}[\s-]?\d{4}$/;
    return regex.test(phone);
}

const validarCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

const validarCNPJ = (cnpj: string): boolean => {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
}

const verificarSenhaForte = (senha: string) => {
    const criterios = [
        { regex: /.{8,}/, mensagem: "Pelo menos 8 caracteres" },
        { regex: /[A-Z]/, mensagem: "Pelo menos uma letra maiúscula" },
        { regex: /[a-z]/, mensagem: "Pelo menos uma letra minúscula" },
        { regex: /[0-9]/, mensagem: "Pelo menos um número" },
        { regex: /[\W_]/, mensagem: "Pelo menos um caractere especial" }
    ];

    const resultados = criterios.map(criterio => ({
        valido: criterio.regex.test(senha),
        mensagem: criterio.mensagem
    }));

    const forte = resultados.every(resultado => resultado.valido);

    return {
        forte,
        resultados
    };
};

const ValidationHelper = {
  validarEmail,
  validarTelephone,
  validarCPF,
  validarCNPJ,
  verificarSenhaForte
};

export default ValidationHelper;