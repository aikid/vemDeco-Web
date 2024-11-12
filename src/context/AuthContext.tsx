import React, { createContext, useCallback, useState, useContext } from "react";
import ResumoRapidoService from "../Service/resumo-rapido-service";
import { ISignInData } from "../interfaces/signin.interfaces";
import generalHelper from "../helpers/generalHelper";
import { SubscriptionData } from "../interfaces/signup.interfaces";

interface UserData {
    username: string;
    userPlan: SubscriptionData
    authkey: string;
    token: string;
    gatewayCustomerId: string;
    loginTime: string;
}

interface AuthContextData {
   user: UserData;
   signIn(data: ISignInData): Promise<boolean>;
   updateSubscription(data: SubscriptionData): void;
   signOut(): void;
   verifySubscription(userToken: string): void;
}

interface AuthState {
    authkey: string;
    username: string;
    token: string;
    loginTime: string;
    subscription: SubscriptionData;
    gatewayCustomerId: string;
}

interface Props {
    children: React.ReactNode;
}

const AuthContext =  createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<Props> = ({ children }) => {
    const [data, setData] = useState<AuthState>(() => {
        const token = localStorage.getItem("@DrMobile:token");
        const username = localStorage.getItem("@DrMobile:username");
        const subscription = localStorage.getItem("@DrMobile:subscription");
        const authkey = localStorage.getItem("@DrMobile:authkey");
        const loginTime = localStorage.getItem("@DrMobile:loginTime");
        const gatewayCustomerId = localStorage.getItem("@DrMobile:gatewayCustomerId");

        if(token && username){
            return {
                token,
                username,
                authkey: authkey ? authkey : "unlogged",
                loginTime: loginTime ? loginTime : "",
                subscription: subscription ? JSON.parse(subscription) : {},
                gatewayCustomerId: gatewayCustomerId ? gatewayCustomerId : ""
            }
        }

        return {} as AuthState;
    });

    const signIn = useCallback(async (data: ISignInData)=>{
        try{
            const response = await ResumoRapidoService.signIn(data);
            const { token, username, subscription, gatewayCustomerId } = response.data; 
            const loginTime = new Date().toISOString();
            localStorage.setItem("@DrMobile:authkey","logged");
            localStorage.setItem("@DrMobile:username", username);
            localStorage.setItem("@DrMobile:token", token);
            localStorage.setItem('@DrMobile:loginTime', loginTime);
            localStorage.setItem("@DrMobile:subscription", generalHelper.setUserPlan(subscription));
            localStorage.setItem("@DrMobile:gatewayCustomerId", gatewayCustomerId);
            setData({ token, username, subscription, loginTime, authkey: "logged", gatewayCustomerId });
            return true;
        } catch(e){
            console.log('Erro encontrado:', e);
            return false;
        }
    }, []);

    const signOut = useCallback(() => {
        localStorage.removeItem("@DrMobile:authkey");
        localStorage.removeItem("@DrMobile:username");
        localStorage.removeItem("@DrMobile:token");
        localStorage.removeItem("@DrMobile:loginTime");
        localStorage.removeItem("@DrMobile:subscription");

        setData({} as AuthState);
    }, []);

    const updateSubscription = useCallback((data: SubscriptionData)=>{
        localStorage.setItem("@DrMobile:subscription", generalHelper.setUserPlan(data));
        setData((prevUser) => prevUser ? { ...prevUser, subscription: data}: {} as AuthState );
    }, []);

    const verifySubscription = useCallback(async (userToken: string)=>{
        try{
            const response = await ResumoRapidoService.getUserSubscription(userToken);
            const subscription: SubscriptionData = {
                status: response.data?.status,
                limit: response.data?.planId?.limit,
                subscriptionId: response.data?._id,
                planId: response.data?.planId?._id,
                planName: response.data?.planId?.name,
                isTrial: response.data?.planId?.isTrial,
                consumption: response.data?.consumption
            }
            localStorage.setItem("@DrMobile:subscription", generalHelper.setUserPlan(subscription));
            setData((prevUser) => prevUser ? { ...prevUser, subscription: subscription}: {} as AuthState );
        } catch(e){
            console.log('Erro encontrado:', e);
            return false;
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user: {username: data.username, userPlan: data.subscription, authkey: data.authkey, token: data.token, gatewayCustomerId: data.gatewayCustomerId, loginTime: data.loginTime}, signIn, signOut, updateSubscription, verifySubscription }}>
            {children}
        </AuthContext.Provider>
    );
};

function useAuth(): AuthContextData {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within a AuthProvider');
    }

    return context;
}

export { AuthProvider, useAuth}