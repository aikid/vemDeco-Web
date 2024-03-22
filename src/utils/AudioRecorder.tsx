import { useState, useRef } from "react";


export interface AudioRecorderState {
    getPermission: () => boolean;
    getStream: () => MediaStream;
    getMicrophonePermission: () => Promise<void>;
    setPermission: React.Dispatch<React.SetStateAction<boolean>>;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    audio: string;
}

const AudioRecorder = (): AudioRecorderState => {
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState<MediaStream>(new MediaStream());
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [audio, setAudio] = useState<string>('');

    const getPermission = ()=>{return permission};
    const getStream = ()=>{return stream};

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                if (err instanceof Error){
                    alert(err.message);
                }
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const startRecording = async () => {
        setRecordingStatus("recording");
        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream, { mimeType : 'audio/ogg' });
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
           const audioBlob = new Blob(audioChunks, { type: 'audio/ogg' });
          //creates a playable URL from the blob file.
           const audioUrl = URL.createObjectURL(audioBlob);
           setAudio(audioUrl);
           setAudioChunks([]);
        };
      };
        return{
            getPermission,
            getStream,
            getMicrophonePermission,
            setPermission,
            startRecording,
            stopRecording,
            audio, 
        }
    }
export default AudioRecorder;