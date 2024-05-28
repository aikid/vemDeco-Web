import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";

axios.defaults.baseURL = "http://localhost:3000/";
//axios.defaults.baseURL = "http://resumorapido.drmobile.com.br:3000";
//axios.defaults.baseURL = "https://api.resumorapido.ai/";

axios.defaults.paramsSerializer = {
  serialize: function (params: any) {
    return qs.stringify(params, { indices: false });
  },
};

const executeRequest = async (config: AxiosRequestConfig) => {
  const result = await axios
    .request(config)
    .then((r) => {
      if (r.statusText == "OK") {
        return r.data;
      }
      throw new Error("Erro");
    })
    .catch((e) => {
      throw new Error(e.message);
    });
  return { data: result };
};

const HttpClient = {
  executeRequest,
};

export default HttpClient;
