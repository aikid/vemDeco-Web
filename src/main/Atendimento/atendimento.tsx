import { useEffect, useRef, useState } from "react";
import './atendimento.css';
// import AudioRecorder, {AudioRecorderState}  from "../../utils/AudioRecorder";


function Atendimento() {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const notRecordingText = "Para iniciar o atendimento clique em “iniciar atendimento”. Verifique se seu microfone está conectado!"
    const recordingText = "Seu atendimento já está sendo gravado, ao termino do atendimento clique em “finalizar” para gerar o relatório."
    const [permission, setPermission] = useState(false);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState<MediaStream>(new MediaStream());
    const mediaRecorder = useRef<MediaRecorder>(new MediaRecorder(stream));
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [audio, setAudio] = useState<string>('');


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
                if (err instanceof Error){
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
        const media = new MediaRecorder(stream, { mimeType : 'audio/webm' });
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks:Blob[] = [];
        mediaRecorder.current.ondataavailable = (event) => {
           if (typeof event.data === "undefined") return;
           if (event.data.size === 0) return;
           localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
      };
      const stopRecording = () => {
        setRecordingStatus("inactive");
        //stops the recording instance
        mediaRecorder.current!.stop();
        mediaRecorder.current!.onstop = () => {
          //creates a blob file from the audiochunks data
           const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          //creates a playable URL from the blob file.
           const audioUrl = URL.createObjectURL(audioBlob);
           setAudio(audioUrl);
           setAudioChunks([]);
        };
      };
    const beginRecord =async ()=>{
        console.log(mediaRecorder, stream);
        const permissionGranted = await getMicrophonePermission();
        if(permissionGranted){
            setIsRecording(true);
            await startRecording();
        } else {
            alert("Permissão para o uso do microfone não concedida"); // Trate o caso em que a permissão foi negada
        }
        
    }
    
    const stopRecord = ()=>{
        setIsRecording(false);
        setPermission(false);
        stopRecording();
    }


    const recordinTextRender= (isRecording: boolean)=>{
        if(isRecording){
            return(
                <div className="recordingArea">
                    <text className="recordText">{recordingText}</text>
                    <button onClick={stopRecord} className="recordingButton">Finalizar atendimento</button>
                </div>
            )
        }
        return(
            <div className="recordingArea">
                <text className="recordText">{notRecordingText}</text>
                <button onClick={()=>beginRecord()} className="notRecordingButton">Iniciar atendimento &rarr;</button>
            </div>
        )
    }
    return(
        <div className="container">
            {recordinTextRender(isRecording)}
            <div className="audio-container">
            <audio src={audio} controls></audio>
            <a download href={audio}>
                Download Recording
            </a>
   </div> 
        </div>
    );
}

export default Atendimento;