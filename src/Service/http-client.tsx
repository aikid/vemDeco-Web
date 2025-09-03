import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";

axios.defaults.baseURL = "http://localhost:3333/";
//axios.defaults.baseURL = "https://dev.resumorapido.ai:8443";
//axios.defaults.baseURL = "https://apidev.resumorapido.ai:8443";
//axios.defaults.baseURL = "http://resumorapido.drmobile.com.br:3000";
//axios.defaults.baseURL = "https://api.resumorapido.ai/";

axios.defaults.paramsSerializer = {
  serialize: function (params: any) {
    return qs.stringify(params, { indices: false });
  },
};

const executeRequest = async (config: AxiosRequestConfig) => {
  try {
    const response = await axios.request(config);

    if (response.status === 200) {
      return { data: response.data };
    }

    throw new Error("Erro na resposta: Status diferente de 200");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Lança o objeto da resposta diretamente se existir
      if (error.response?.data) {
        throw error.response.data;
      }
    }

    // Lança o erro padrão para casos não relacionados ao Axios
    throw new Error(error instanceof Error ? error.message : "Erro desconhecido");
  }
};

const HttpClient = {
  executeRequest,
};

export default HttpClient;
