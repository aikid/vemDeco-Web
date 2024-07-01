import { LoginResponse, SubscriptionData } from "../interfaces/signup.interfaces";

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

const generalHelper = {
    prepareErrorMessage,
    setUserPlan,
    getUserPlan
};
  
export default generalHelper;