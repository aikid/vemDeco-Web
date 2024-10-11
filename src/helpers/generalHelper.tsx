import { SubscriptionData } from "../interfaces/signup.interfaces";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const prepareErrorMessage = (dataMessage: any ): string => {
    if(dataMessage && dataMessage.response.data.message){
        return dataMessage.response.data.message;
    }
    return "Ocorreu um erro ao realizar a operação, caso persista contate a administração do sistema"
}

const setUserPlan = (data: SubscriptionData): string => {
    if(data && data.planId){
        return JSON.stringify(data)
    }
    return JSON.stringify({isTrial:false})
}

const getUserPlan = (data: SubscriptionData): boolean => {
    if(data && data.planId && data.consumption && data.limit){
        if(data.limit - data.consumption <= 0){
            return false
        }
        return true
    }
    return false
}


const getDiference = (num1: number | undefined, num2: number | undefined) => {
    return num1 !== undefined && num2 !== undefined 
      ? Math.max(0, num1 - num2) 
      : 0;
};

const getNotificationMessage = (notification: any) => {
    const notificationMessages: { [key: string]: string } = {
        'invite-subscription': `Voce foi convidado por ${notification.data.name} a participar de um plano`,
        'payment-error': 'Houve um erro no pagamento, por favor atualize seus dados bancários em configurações',
        'plan-expires': 'O seu plano está prestes a expirar, por favor faça a renovação',
    };
    return notificationMessages[notification.notificationType] || 'Notificação desconhecida.';
}

const formattedDate = (date:string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
}

const generalHelper = {
    prepareErrorMessage,
    setUserPlan,
    getUserPlan,
    getNotificationMessage,
    formattedDate,
    getDiference
};
  
export default generalHelper;