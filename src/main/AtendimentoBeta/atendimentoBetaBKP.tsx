import React, { useEffect, useState } from 'react';
import "./atendimentoBeta.css";
import TrancribeAndSummarize from "../../Service/resumo-rapido-service";
import { useNavigate } from "react-router-dom";
import SoundWave from "../../utils/soundwave/soundwave";
import NavBar from "../../utils/navbar/navbar";
import Loader from "../../utils/loader/loader";

const AtendimentoBeta = () => {
  const [permission, setPermission] = useState(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [logged, setLogged] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>("");
  const notRecordingText =
    "Para iniciar o atendimento clique em “iniciar atendimento”. Verifique se seu microfone está conectado!";
  const recordingText =
    "Seu atendimento já está sendo gravado, ao termino do atendimento clique em “finalizar” para gerar o relatório.";

  let navigate = useNavigate();
  
  let authkey:string | null = "unlogged";
  let mediaRecorder: MediaRecorder;

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
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
      setIsRecording(true);
      startRecording();
    } else {
      alert("Permissão para o uso do microfone não concedida"); // Trate o caso em que a permissão foi negada
    }
  };

  const startRecording = async () => {
    console.log('Iniciandio gravação');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const audioStream = audioContext.createMediaStreamSource(stream);
    const audioProcessor = audioContext.createScriptProcessor(1024, 1, 1);
    
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event: any) => {
      console.log('Entrei no audio avaliado: ', event);
      if (event.data.size > 0) {
        sendAudioChunk(event.data);
      }
    };

    audioStream.connect(audioProcessor);
    audioProcessor.connect(audioContext.destination);
    mediaRecorder.start();
  };

  const sendAudioChunk = async (audioChunk: any) => {
    const apiKey = 'AIzaSyBihcqE8TfHiwTgemilCqFlaE3_mvJvF0k'; // Substitua pelo sua chave de API do Google Cloud
    const url = `wss://speech.googleapis.com/v1/speech:streamingrecognize?key=${apiKey}`;

    const socket = new WebSocket(url);
    
    socket.onopen = () => {
      socket.send(JSON.stringify({
        streamingConfig: {
          config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 44100,
            languageCode: 'pt-BR',
          },
        },
      }));
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.results && response.results[0] && response.results[0].alternatives[0]) {
        setTranscription(response.results[0].alternatives[0].transcript);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket closed.');
    };

    socket.send(audioChunk);
  };

  const stopRecording = () => {
    console.log('Finalizando gravação');
    if(mediaRecorder){
      setIsRecording(true);
      mediaRecorder.stop();
    }
  };

  const recordinTextRender = (isRecording: boolean) => {
    if (isRecording) {
      return (
        <div className="recordingArea"> 
          <p className="recordText">{recordingText}</p>
          <SoundWave></SoundWave>
          <button onClick={() => stopRecording()} className="recordingButton">
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

  useEffect(()=>{
    authkey = localStorage.getItem("authkey");
    setLogged(authkey == 'logged');
    setLoading(false);
  },[])
  return (
    loading?<Loader/>:
    logged?
    <div>
      <NavBar></NavBar>
      <div className="atendimentoContainer">
      {recordinTextRender(isRecording)}

      <div className="audio-container">
        <h2>Transcrição:</h2>
        <p>{transcription}</p>
        {/* <audio className="audioPlayer" src={audio} controls></audio> */}
        {/* <a className="audioLink" download href={audio}>
          Download Recording
        </a> */}
        {/* <button className="summarizeButton" onClick={sendAudioToSummarize}>
          Resumir Audio
        </button> */}
      </div>
    </div>
    </div>
    
     :
    <div>
      Acesso não autorizado
    </div>
  );
};

export default AtendimentoBeta;
