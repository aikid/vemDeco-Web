import {JSXElementConstructor, Key, ReactElement, ReactNode, 
        ReactPortal, useEffect, useRef, useState} from "react";
import "./atendimento.css";
import TrancribeAndSummarize from "../../Service/resumo-rapido-service";
import { useNavigate } from "react-router-dom";
import SoundWave from "../../utils/soundwave/soundwave";

function Atendimento() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const notRecordingText =
    "Para iniciar o atendimento clique em “iniciar atendimento”. Verifique se seu microfone está conectado!";
  const recordingText =
    "Seu atendimento já está sendo gravado, ao termino do atendimento clique em “finalizar” para gerar o relatório.";
  const [permission, setPermission] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState<MediaStream>(new MediaStream());
  const mediaRecorder = useRef<MediaRecorder>(
    new MediaRecorder(stream, { mimeType: "audio/webm" })
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string>("");
  const [response, setResponse] = useState<any>();
  let navigate = useNavigate(); 
  let authkey:string | null = "unlogged";

  const[logged, setLogged] = useState<boolean>(false)
  
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));



  useEffect(() => {
    getMicrophonePermission();
  });

  useEffect(()=>{
    authkey = localStorage.getItem("authkey");
    setLogged(authkey == 'logged');
  },[])

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
        return true;
      } catch (err) {
        if (err instanceof Error) {
          alert(err.message);
        }
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
    return false;
  };

  const startRecording = async () => {
    setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    const media = await new MediaRecorder(stream!, { mimeType: "audio/webm" });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };
  const stopRecording = async () => {
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current!.stop();
    mediaRecorder.current!.onstop = async () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      // setAudioChunks([]);
    };
    await sleep(1500);
  };
  const beginRecord = async () => {
    const permissionGranted = await getMicrophonePermission();
    if (permissionGranted) {
      setIsRecording(true);
      startRecording();
    } else {
      alert("Permissão para o uso do microfone não concedida"); // Trate o caso em que a permissão foi negada
    }
  };

  const stopRecord = async () => {
    setIsRecording(false);
    setPermission(false);
    await stopRecording();
    await sendAudioToSummarize();
  };

  const recordinTextRender = (isRecording: boolean) => {
    if (isRecording) {
      return (
        <div className="recordingArea"> 
          <p className="recordText">{recordingText}</p>
          <SoundWave></SoundWave>
          <button onClick={stopRecord} className="recordingButton">
            Finalizar atendimento
          </button>
        </div>
      );
    }
    return (
      <div className="recordingArea">
        <p className="recordText">{notRecordingText}</p>
        <button onClick={() => beginRecord()} className="notRecordingButton">
          Iniciar atendimento &rarr;
        </button>
      </div>
    );
  };

  const sendAudioToSummarize = async () => {
    if(audioChunks.length>0){
      const audioBlob = new Blob(audioChunks, { type: "audio/ogg" });
      let responseP = await TrancribeAndSummarize.postAudio(audioBlob);
      setResponse(responseP);
      navigate('/resumo', {state:{response:responseP}})
    }
    else{
      alert("Seu audio não foi gravado")
    }
  };



  return (
    logged?
    <div className="atendimentoContainer">
      {recordinTextRender(isRecording)}

      <div className="audio-container">
        {/* <audio className="audioPlayer" src={audio} controls></audio> */}
        {/* <a className="audioLink" download href={audio}>
          Download Recording
        </a> */}
        {/* <button className="summarizeButton" onClick={sendAudioToSummarize}>
          Resumir Audio
        </button> */}
      </div>
    </div>
     :
    <div>
      Acesso não autorizado
    </div>
  );
}

export default Atendimento;
