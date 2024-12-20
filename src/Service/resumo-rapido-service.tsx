import HttpClient from "./http-client";
import FormData from "form-data";
import { ISignUpData } from "../interfaces/signup.interfaces";
import { ISignInData } from "../interfaces/signin.interfaces";
import { IPasswordRequestReset, IPasswordReset } from "../interfaces/passwordReset.interfaces";
import { IUpdateUserProfileRequest } from "../model/user/update-user-profile-request";
import { IUpdateUserSubscriptionRequest, IBindUserSubscriptionRequest } from "../model/user/update-user-subscription-request";
import { IPromptRequest } from "../model/user/user-prompt-request";

const defaultPath = "transcribe-and-summarize";
const alternativePath = "summarize-transcription";
const defaultPromptPath = "transcribe-and-summarize-temp"
const signUpPath = "/user/create";
const signInPath = "/user/signin";
const resetPasswordPath = "/user/send-email";
const resetPasswordRequestPath = "/user/update-password";
const getUserStatePath = "/user/get-states";
const getUserInfoPath = "/user/get-info";
const getUserPlansPath = "/user/list-plans";
const updateProfilePath = "/user/update-profile"
const updateSubscriptionPath = "/user/update-subscription"
const getUserNotificationsPath = "/user/find-notification";
const getUserByEmailPath = "/user/get-user-by-email";
const bindSubscriptionPath = "/user/bind-subscription";
const savePromptPath = "/user/create-prompt";
const userPromptPath = "/user/get-user-prompts";
const updatePromptPath = "/user/update-prompt";
const setDefaultPromptPath = "/user/set-default-prompt";
const getPaymentLinkPath = "/user/get-payment-link";
const getPaymentsPath = "/user-payments";
const deleteSubscriptionPath = "/user/delete-subscription";
const getUserSubscriptionPath = "/user/find-subscription";
const createNotificationPath = "/user/create-notification";
const getUserResumesPath = "get-last-transcriptions";
const reprocessUserAudioPath = "reprocess-transcribe";
const userListPath = "/user/list";
const getAllPaymentsPath = "/user/payments";

const postAudio = async (audio: any, userName: string | null = "conversa-medico-paciente", token: string | null): Promise<any> => {
  const formData = new FormData();
  formData.append("audio", audio);
  formData.append("prompt", userName);
  return await HttpClient.executeRequest({
    method: "post",
    url: `${defaultPath}`,
    headers: { "Authorization": `Bearer ${token}`,"x-api-token": "bc22997835be3d139056f134d1b8cd37d89679c3" },
    data: formData,
  });
};

const postAudioAndPrompt = async (audio: any, prompt: string | null = "conversa-medico-paciente", token: string): Promise<any> => {
  const formData = new FormData();
  formData.append("audio", audio);
  formData.append("prompt", prompt);
  return await HttpClient.executeRequest({
    method: "post",
    url: `${defaultPromptPath}`,
    headers: { "Authorization": `Bearer ${token}`, "x-api-token": "bc22997835be3d139056f134d1b8cd37d89679c3" },
    data: formData,
  });
};

const postTranscribe = async (transcription: any, userName: string | null = "conversa-medico-paciente", token: string): Promise<any> => {
  const formData = new FormData();
  formData.append("transcription", transcription);
  formData.append("prompt", userName);
  return await HttpClient.executeRequest({
    method: "post",
    url: `${alternativePath}`,
    headers: { "Authorization": `Bearer ${token}`, "x-api-token": "bc22997835be3d139056f134d1b8cd37d89679c3" },
    data: formData,
  });
};

const signUp = async (data: ISignUpData): Promise<any> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone.replace(/\D/g, ''));
  formData.append("password", data.password);
  formData.append("type", data.tipoPessoa);
  formData.append("occupation", data.occupation);
  formData.append("document", data.document.replace(/\D/g, ''));

  return await HttpClient.executeRequest({
    method: "post",
    url: `${signUpPath}`,
    headers: { "x-api-token": "bc22997835be3d139056f134d1b8cd37d89679c3", "Content-Type": "application/json" },
    data: formData,
  });
};

const signIn = async (data: ISignInData): Promise<any> => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("password", data.password);

  return await HttpClient.executeRequest({
    method: "post",
    url: `${signInPath}`,
    headers: { "x-api-token": "bc22997835be3d139056f134d1b8cd37d89679c3", "Content-Type": "application/json" },
    data: formData,
  });
};

const getStates = async(token: string): Promise<any> =>{
  return await HttpClient.executeRequest({
    method: "GET",
    url: `${getUserStatePath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
}

const getCities = async(stateId: string): Promise<any> =>{
  return await HttpClient.executeRequest({
    method: "GET",
    url: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios`,
  });
}

const resetPassword = async (data: IPasswordReset): Promise<any> => {
  const formData = new FormData();
  formData.append("email", data.email);

  return await HttpClient.executeRequest({
    method: "post",
    url: `${resetPasswordPath}`,
    headers: { "x-api-token": "bc22997835be3d139056f134d1b8cd37d89679c3", "Content-Type": "application/json" },
    data: formData,
  });
};

const getUserInfo = async (token: string): Promise<any> => {

  return await HttpClient.executeRequest({
    method: "get",
    url: `${getUserInfoPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
};

const getPlansAvaliable = async (token: string): Promise<any> => {

  return await HttpClient.executeRequest({
    method: "get",
    url: `${getUserPlansPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
};

const requestResetPassword = async (data: IPasswordRequestReset, token: string | null): Promise<any> => {
  const formData = new FormData();
  formData.append("token", token);
  formData.append("password", data.password);

  return await HttpClient.executeRequest({
    method: "post",
    url: `${resetPasswordRequestPath}`,
    headers: { "x-api-token": "bc22997835be3d139056f134d1b8cd37d89679c3", "Content-Type": "application/json" },
    data: formData,
  });
};

const getAddressByCep = async (cep: string) => {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!response.ok) {
    throw new Error('Erro ao buscar CEP');
  }
  return await response.json();
};

const updateUserProfile = async(data: IUpdateUserProfileRequest, token: string | null): Promise<any> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key as keyof IUpdateUserProfileRequest]);
  });

  return await HttpClient.executeRequest({
    method: "post",
    url: `${updateProfilePath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    data: formData,
  });
}

const updateUserSubscription = async(planId: string | undefined, token: string | null): Promise<any> => {
  const formData = new FormData();
  formData.append("planId", planId);

  return await HttpClient.executeRequest({
    method: "post",
    url: `${updateSubscriptionPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    data: formData,
  });
}

const getNotifications = async(token: string): Promise<any> =>{
  return await HttpClient.executeRequest({
    method: "GET",
    url: `${getUserNotificationsPath}?active=yes`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
}

const getUserByEmail = async(token: string, email: string): Promise<any> =>{
  return await HttpClient.executeRequest({
    method: "GET",
    url: `${getUserByEmailPath}?email=${email}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
}

const bindSubscription = async(token: string | null, data: IBindUserSubscriptionRequest): Promise<any> => {
  const formData = new FormData();
  formData.append("userId", data.userId);
  formData.append("name", data.name);
  formData.append("email", data.email);

  return await HttpClient.executeRequest({
    method: "post",
    url: `${bindSubscriptionPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    data: formData,
  });
}

const savePromptData = async(token: string | null, data: IPromptRequest): Promise<any> => {
  const formData = new FormData();
  formData.append("prompt", data.prompt);

  return await HttpClient.executeRequest({
    method: "post",
    url: `${savePromptPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    data: formData,
  });
}

const getUserPrompts = async(token: string): Promise<any> =>{
  return await HttpClient.executeRequest({
    method: "GET",
    url: `${userPromptPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
}

const setDefaultPrompts = async(token: string | null, promptId: string): Promise<any> =>{
  const formData = new FormData();
  formData.append("id", promptId);

  return await HttpClient.executeRequest({
    method: "PATCH",
    url: `${setDefaultPromptPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    data: formData,
  });
}

const updatePrompt = async(token: string | null, promptId: string, data: IPromptRequest): Promise<any> =>{
  const formData = new FormData();
  formData.append("id", promptId);
  formData.append("prompt", data.prompt);
  return await HttpClient.executeRequest({
    method: "PATCH",
    url: `${updatePromptPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    data: formData,
  });
}

const getPaymentLink = async(token: string, gatewayCode: string): Promise<any> =>{
  return await HttpClient.executeRequest({
    method: "GET",
    url: `${getPaymentLinkPath}?id=${gatewayCode}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
}

const deleteUserSubscription = async(token: string | null): Promise<any> => {
  return await HttpClient.executeRequest({
    method: "DELETE",
    url: `${deleteSubscriptionPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
}

const getUserPayments = async(token: string): Promise<any> =>{
  return await HttpClient.executeRequest({
    method: "GET",
    url: `${getPaymentsPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
}

const getUserSubscription = async(token: string): Promise<any> =>{
  return await HttpClient.executeRequest({
    method: "GET",
    url: `${getUserSubscriptionPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
}

const createUserNotification = async(token: string | null, userId: string, username: string, notificationType: string): Promise<any> => {
  const formData = new FormData();
  const userData = {name:username}
  formData.append("userId", userId);
  formData.append("notificationType", notificationType);
  formData.append("data", JSON.stringify(userData));

  return await HttpClient.executeRequest({
    method: "post",
    url: `${createNotificationPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    data: formData,
  });
}

const reprocessUserAudio = async (token: string, link: string): Promise<any> => {
  const formData = new FormData();
  formData.append("link", link);
  console.log(formData);
  return await HttpClient.executeRequest({
    method: "post",
    url: `${reprocessUserAudioPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    data: formData,
  });
};

const getUserResumes = async(token: string): Promise<any> =>{
  return await HttpClient.executeRequest({
    method: "GET",
    url: `${getUserResumesPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
}

const getUserList = async(token: string): Promise<any> =>{
  return await HttpClient.executeRequest({
    method: "GET",
    url: `${userListPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
}

const getAllPayments = async(token: string): Promise<any> =>{
  return await HttpClient.executeRequest({
    method: "GET",
    url: `${getAllPaymentsPath}`,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
}

const ResumoRapidoService = {
  postAudio,
  postTranscribe,
  postAudioAndPrompt,
  signUp,
  signIn,
  getStates,
  getCities,
  resetPassword,
  requestResetPassword,
  getUserInfo,
  getPlansAvaliable,
  getAddressByCep,
  updateUserProfile,
  updateUserSubscription,
  getNotifications,
  getUserByEmail,
  bindSubscription,
  savePromptData,
  getUserPrompts,
  setDefaultPrompts,
  updatePrompt,
  getPaymentLink,
  deleteUserSubscription,
  getUserPayments,
  getUserSubscription,
  createUserNotification,
  reprocessUserAudio,
  getUserResumes,
  getUserList,
  getAllPayments
};

export default ResumoRapidoService;
