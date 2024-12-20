import {useEffect, useRef, useState} from "react";
import "./atendimento.css";
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SoundWave from "../../utils/soundwave/soundwave";
import Modal from "../../components/Modal/Modal";
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import { NotepadText, Sparkles } from 'lucide-react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Button } from "@mui/material";
import generalHelper from "../../helpers/generalHelper";

function Atendimento() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const notRecordingText =
    "Para iniciar o atendimento clique em “iniciar atendimento”. Verifique se seu microfone está conectado!";
  const [recordingText, setRecordingText] = useState("Fique tranquilo, estamos ouvindo e anotando tudo ✍️");
  const [permission, setPermission] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState<MediaStream>(new MediaStream());
  const mediaRecorder = useRef<MediaRecorder>(
    new MediaRecorder(stream, { mimeType: "audio/webm" })
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string>("");
  const [response, setResponse] = useState<any>();
  const [userNotHasPlan, setNotUserHasPlan] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'success' | 'confirm'>('success');
  let navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const socket = useRef<WebSocket | null>(null);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


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
    if(userNotHasPlan){
      setTitle("Ainda há mais um passo para começar a fazer seus resumos");
      setMessage("Você precisa contratar um plano, clique em ver planos e escolha um que combine com seu uso diário");
      setModalOpen(true);
      return;
    }
    const permissionGranted = await getMicrophonePermission();
    if (permissionGranted) {
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setStream(streamData);
    } else {
      alert("Permissão para o uso do microfone não concedida"); // Trate o caso em que a permissão foi negada
    }
  };

  const stopRecord = async () => {
    setLoading(true);
    setIsRecording(false);
    setPermission(false);
    await stopRecording();
    await sendAudioToSummarize();
    setLoading(false);
  };

  const recordinTextRender = (isRecording: boolean) => {
    if (loading) {
      return (
        <>
          <div className="startRecord">
            <SoundWave></SoundWave>
            <p className="recordText">{recordingText}</p>
          </div>
        </>
      );
    }
    if (isRecording) {
      return (
        <>
          <div className="recordingArea">
            <Button onClick={stopRecord} className="recordingButton" startIcon={<CheckCircleOutlineIcon />}>
              Finalizar atendimento
            </Button>
          </div>
          <div className="startRecord">
            <SoundWave></SoundWave>
            <p className="recordText">{recordingText}</p>
          </div>
        </>
      );
    }
    return (
      <div className="recordingArea">
        {/* <p className="recordText">{notRecordingText}</p> */}
        <Button onClick={() => beginRecord()} className="notRecordingButton" startIcon={<Sparkles />}>
          Novo atendimento
        </Button>
        <Button onClick={() => navigate('/resumos')} className="notRecordingButton" startIcon={<NotepadText />}>
          Resumos Anteriores
        </Button >
      </div>
    );
  };

  const sendAudioToSummarize = async () => {
    if(audioChunks.length>0){
      setRecordingText("Gerando seu resumo, por favor aguarde!.... ");
      const audioBlob = new Blob(audioChunks, { type: "audio/ogg" });
      let responseP = await ResumoRapidoService.postAudio(audioBlob,user.username,user.token);
      setLoading(false);
      setResponse(responseP);
      navigate('/resumo', {state:{response:responseP}})
    }
    else{
      setRecordingText("Ocorreu um erro ao processar o audio, por favor tente novamente");
    }
  };

  useEffect(()=>{
    if(stream && stream.active){
      setIsRecording(true);
      startRecording();
    }
  },[stream])

  useEffect(() => {
    const userPlan = user.userPlan ?? '{}'
    const hasExpiresConsume = generalHelper.getDiference(userPlan.limit, userPlan.consumption)
    console.log(hasExpiresConsume);
    if(userPlan && userPlan.status && hasExpiresConsume > 0){
      setNotUserHasPlan(false)
    }
    
    getMicrophonePermission();

    // Conecta ao servidor WebSocket
    // socket.current = new WebSocket('ws://localhost:3000');

    // socket.current.onopen = () => {
    //   console.log('Connected to WebSocket server');
    // };

    // socket.current.onclose = () => {
    //   console.log('Disconnected from WebSocket server');
    // };

    // return () => {
    //   socket.current?.close();
    // };
  }, []);

  return (
    <DashboardLayout title="Atendimento">
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
      <Modal
          show={isModalOpen}
          onClose={()=>setModalOpen(false)}
          title={title}
          content={<p>{message}</p>}
          actions={
          <button className="confirmModal" onClick={()=> navigate('/planos')}>Ver Planos</button>
        }
      />
    </DashboardLayout>
  );
}

export default Atendimento;