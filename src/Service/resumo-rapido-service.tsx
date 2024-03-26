import HttpClient from "./http-client";
import FormData from "form-data";

const defaultPath = "transcribe-and-summarize";

const postAudio = async (audio: any): Promise<any> => {
  const formData = new FormData();
  formData.append("audio", audio);
  formData.append("prompt", "conversa-medico-paciente");
  console.log(formData);
  return await HttpClient.executeRequest({
    method: "post",
    url: `${defaultPath}`,
    headers: { "x-api-token": "bc22997835be3d139056f134d1b8cd37d89679c3" },
    data: formData,
  });
};

const TrancribeAndSummarize = {
  postAudio,
};

export default TrancribeAndSummarize;
