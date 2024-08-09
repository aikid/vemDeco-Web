import { LoginResponse, SubscriptionData } from "../interfaces/signup.interfaces";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const prepareErrorMessage = (dataMessage: any ): string => {
    if(dataMessage && dataMessage.response.data.message){
        return dataMessage.response.data.message;
    }
    return "Ocorreu um erro ao realizar a operação, caso persista contate a administração do sistema"
}

const setUserPlan = (data: LoginResponse): string => {
    if(data.subscription && data.subscription.planId){
        return JSON.stringify(data.subscription)
    }
    return JSON.stringify({isTrial:false})
}

const getUserPlan = (data: SubscriptionData): boolean => {
    if(data && data.planId && !data.isTrial){
        return true
    }
    return false
}

const getNotificationMessage = (type: string) => {
    const notificationMessages: { [key: string]: string } = {
        'invite-subscription': 'Voce foi convidado a participar de um plano',
        'payment-error': 'Houve um erro no pagamento, por favor atualize seus dados bancários em configurações',
        'plan-expires': 'O seu plano está prestes a expirar, por favor faça a renovação',
    };
    return notificationMessages[type] || 'Notificação desconhecida.';
}

const formattedDate = (date:string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
}

const generalHelper = {
    prepareErrorMessage,
    setUserPlan,
    getUserPlan,
    getNotificationMessage,
    formattedDate
};
  
export default generalHelper;