import {JSXElementConstructor, Key, ReactElement, ReactNode, 
  ReactPortal, useEffect, useRef, useState} from "react";
import useSpeechToText, { ResultType } from 'react-hook-speech-to-text';
import "./atendimentoBeta.css";
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SoundWave from "../../utils/soundwave/soundwave";
import NavBar from "../../utils/navbar/navbar";
import Loader from "../../utils/loader/loader";
const AtendimentoBeta = () => {
  const [permission, setPermission] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [logged, setLogged] = useState<boolean>(false);
  const [isRecord, setIsRecord] = useState<boolean>(false);
  const [response, setResponse] = useState<any>();
  const notRecordingText = "Para iniciar o atendimento clique em “iniciar atendimento”. Verifique se seu microfone está conectado!";
  const recordingText = "Seu atendimento já está sendo gravado, ao termino do atendimento clique em “finalizar” para gerar o relatório.";
  let navigate = useNavigate();
  let authkey:string | null = "unlogged";
  const { user } = useAuth();

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    crossBrowser: true,
    googleApiKey: 'AIzaSyBihcqE8TfHiwTgemilCqFlaE3_mvJvF0k',
    useLegacyResults: false
  });

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        setPermission(true);
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

  const beginRecord = async () => {
    const permissionGranted = await getMicrophonePermission();
    if (permissionGranted) {
      setIsRecord(true);
      startRecording();
    } else {
      alert("Permissão para o uso do microfone não concedida"); // Trate o caso em que a permissão foi negada
    }
  };

  const startRecording = async () => {
    startSpeechToText();
  };

  const stopRecording = async () => {
    setIsRecord(false);
    stopSpeechToText();    
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const sendAudioToSummarize = async (transcription: string) => {
    if(transcription !== ""){
      let responseP = await ResumoRapidoService.postTranscribe(transcription,user.username,user.token);
      setResponse(responseP);
      navigate('/resumo', {state:{response:responseP}})
    }
    else{
      alert("Seu audio não foi gravado")
    }
  };

  useEffect(() => {
    getMicrophonePermission();
  });

  useEffect(() => {
    let timer: any;
    const restartTime = 4 * 60 * 1000 + 55 * 1000; // 4 minutos e 55 segundos em milissegundos
    if (isRecord) {
      setStartTime(Date.now());

      timer = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        setElapsedTime(elapsedTime);
        if (elapsedTime >= restartTime && isRecording) {
          // Se o tempo decorrido for maior ou igual a 4 minutos e 55 segundos, reinicie a gravação
          stopSpeechToText();
          startSpeechToText();
        }
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRecord, startTime]);

  useEffect(()=>{
    results.map((result) => (
      //@ts-ignore
      console.log('Transcrição: ',result.transcript)
    ))
    if(results.length > 0 && !isRecord){
      //@ts-ignore
      const fullTranscription = results.map(result => result.transcript).join(' ');
      sendAudioToSummarize(fullTranscription);
    }
  },[results, isRecord])

  useEffect(()=>{
    if(!isRecording && isRecord){
      startSpeechToText();
    } 
  },[isRecording])

  


  if (error) {
    return (
      <p>Web Speech API is not available in this browser 🤷‍</p>
    );
  }


  const recordinTextRender = (isRecord: boolean) => {
    if (isRecord) {
      return (
        <div className="recordingArea"> 
          <p className="recordText">{recordingText}</p>
          <SoundWave></SoundWave>
          <button onClick={()=> stopRecording()} className="recordingButton">
            Finalizar atendimento
          </button>
        </div>
      );
    }
    return (
      <div className="recordingArea">
        <p className="recordText">{notRecordingText}</p>
        <button onClick={()=> beginRecord()} className="notRecordingButton">
          Iniciar atendimento &rarr;
        </button>
      </div>
    );
  };

  return (
    loading?<Loader/>:
    <div>
      <NavBar></NavBar>
      <div className="atendimentoContainer">
      <h3>Tempo de Gravação: {formatTime(elapsedTime)}</h3>
      {recordinTextRender(isRecord)}

      <div className="audio-container">
        {/* <h3>Transcrição:</h3>
          <ul>
            {results.map((result) => (
              <li key={result.timestamp}>{result.transcript}</li>
            ))}
            {interimResult && <li>{interimResult}</li>}
          </ul> 
        */}
      </div>
    </div>
    </div>
  );
};

export default AtendimentoBeta;