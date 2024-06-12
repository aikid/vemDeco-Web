import HttpClient from "./http-client";
import FormData from "form-data";
import { ISignUpData } from "../interfaces/signup.interfaces";
import { ISignInData } from "../interfaces/signin.interfaces";
import { IPasswordRequestReset, IPasswordReset } from "../interfaces/passwordReset.interfaces";

const defaultPath = "transcribe-and-summarize";
const alternativePath = "summarize-transcription";
const signUpPath = "/user/create";
const signInPath = "/user/signin";
const resetPasswordPath = "/user/send-email";
const resetPasswordRequestPath = "/user/update-password";
const stateIbgePath = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
const getUserInfoPath = "/user/get-info";

const postAudio = async (audio: any, userName: string | null = "conversa-medico-paciente"): Promise<any> => {
  const formData = new FormData();
  formData.append("audio", audio);
  formData.append("prompt", userName);
  return await HttpClient.executeRequest({
    method: "post",
    url: `${defaultPath}`,
    headers: { "x-api-token": "bc22997835be3d139056f134d1b8cd37d89679c3" },
    data: formData,
  });
};

const postTranscribe = async (transcription: any, userName: string | null = "conversa-medico-paciente"): Promise<any> => {
  const formData = new FormData();
  formData.append("transcription", transcription);
  formData.append("prompt", userName);
  return await HttpClient.executeRequest({
    method: "post",
    url: `${alternativePath}`,
    headers: { "x-api-token": "bc22997835be3d139056f134d1b8cd37d89679c3", "Content-Type": "application/json" },
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

const getStates = async(): Promise<any> =>{
  return await HttpClient.executeRequest({
    method: "GET",
    url: `${stateIbgePath}`,
  });
}

const getCities = async(stateId: string): Promise<any> =>{
  return await HttpClient.executeRequest({
    method: "GET",
    url: `${stateIbgePath}`,
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


const ResumoRapidoService = {
  postAudio,
  postTranscribe,
  signUp,
  signIn,
  getStates,
  getCities,
  resetPassword,
  requestResetPassword,
  getUserInfo
};

export default ResumoRapidoService;
