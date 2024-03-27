import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { useLocation } from "react-router-dom";
import "./resumo.css";


function Resumo() {

let location = useLocation();
const response = location.state.response;
console.log(response.data);

const renderResponseArea = (nome:string, list:any)=> {
    return (
        <div className="responseContainer">
            <div className="responseArea">
                <text className="textResponse">{nome}</text>
                <div className="responseDataArea">
                 <textarea >{list}</textarea>
                </div>
            </div>
        </div>
    );
}
const renderResponses = () => {
    const transcription = response.data.transcription;
    const summaryLines = response.data.completion.summary;
    const prescriptionLines =
          response.data.completion.prescription;
        const certificateLines =
          response.data.completion.certificate;

    // return(
    //     
   
    //     )
    
    if (response !== undefined) {
      if (response.data.completion.summary !== undefined) {
        const transcription = response.data.transcription;
        const summaryLines = response.data.completion.summary;
        const prescriptionLines =
          response.data.completion.prescription;
        const certificateLines =
          response.data.completion.certificate;

        return (
            <div className="responseContainer">
                 {renderResponseArea('Trancrição', transcription)}
                 {renderResponseArea('Resumo', summaryLines)}
                 {renderResponseArea('Prescição', prescriptionLines)}
                 {renderResponseArea('Atestado', certificateLines)}
         </div>
        //   <div className="responseContainer">

        //     <div className="responseArea">
        //       <text className="textResponse">Transcrição</text>
        //       <div className="responseDataArea">
        //         {transcription.map(
        //           (
        //             line:
        //               | string
        //               | number
        //               | boolean
        //               | ReactElement<any, string | JSXElementConstructor<any>>
        //               | Iterable<ReactNode>
        //               | ReactPortal
        //               | null
        //               | undefined,
        //             index: Key | null | undefined
        //           ) => (
        //             <p key={index}>
        //               {line}
        //               <br />
        //             </p>
        //           )
        //         )}
        //       </div>
        //     </div>

        //     <div className="responseArea">
        //       <text className="textResponse">Resumo</text>
        //       <div className="responseDataArea">
        //         {summaryLines.map(
        //           (
        //             line:
        //               | string
        //               | number
        //               | boolean
        //               | ReactElement<any, string | JSXElementConstructor<any>>
        //               | Iterable<ReactNode>
        //               | ReactPortal
        //               | null
        //               | undefined,
        //             index: Key | null | undefined
        //           ) => (
        //             <p key={index}>
        //               {line}
        //               <br />
        //             </p>
        //           )
        //         )}
        //       </div>
        //     </div>

        //     <div className="responseArea">
        //       <text className="textResponse">Prescrição</text>
        //       <div className="responseDataArea">
        //         {prescriptionLines.map(
        //           (
        //             line:
        //               | string
        //               | number
        //               | boolean
        //               | ReactElement<any, string | JSXElementConstructor<any>>
        //               | Iterable<ReactNode>
        //               | ReactPortal
        //               | null
        //               | undefined,
        //             index: Key | null | undefined
        //           ) => (
        //             <p key={index}>
        //               {line}
        //               <br />
        //             </p>
        //           )
        //         )}
        //       </div>
        //     </div>

        //     <div className="responseArea">
        //       <text className="textResponse">Atestado</text>
        //       <div className="responseDataArea">
        //         {certificateLines.map(
        //           (
        //             line:
        //               | string
        //               | number
        //               | boolean
        //               | ReactElement<any, string | JSXElementConstructor<any>>
        //               | Iterable<ReactNode>
        //               | ReactPortal
        //               | null
        //               | undefined,
        //             index: Key | null | undefined
        //           ) => (
        //             <p key={index}>
        //               {line}
        //               <br />
        //             </p>
        //           )
        //         )}
        //       </div>
        //     </div>
        //   </div>
        );
      }

      const transcription = response.data.transcription;
      const completion = response.data.completion;
      return(

        <div className="responseContainer">
            {renderResponseArea('Trancrição', transcription)}
            {renderResponseArea('Resumo', completion)}
        </div>
    //     <div className="responseContainer">

    //     <div className="responseArea">
    //       <text className="textResponse">Transcrição</text>
    //       <div className="responseDataArea">
    //         {transcription.map(
    //           (
    //             line:
    //               | string
    //               | number
    //               | boolean
    //               | ReactElement<any, string | JSXElementConstructor<any>>
    //               | Iterable<ReactNode>
    //               | ReactPortal
    //               | null
    //               | undefined,
    //             index: Key | null | undefined
    //           ) => (
    //             <p key={index}>
    //               {line}
    //               <br />
    //             </p>
    //           )
    //         )}
    //       </div>
    //     </div>

    //     <div className="responseArea">
    //       <text className="textResponse">Resultado</text>
    //       <div className="responseDataArea">
    //         {completion.map(
    //           (
    //             line:
    //               | string
    //               | number
    //               | boolean
    //               | ReactElement<any, string | JSXElementConstructor<any>>
    //               | Iterable<ReactNode>
    //               | ReactPortal
    //               | null
    //               | undefined,
    //             index: Key | null | undefined
    //           ) => (
    //             <p key={index}>
    //               {line}
    //               <br />
    //             </p>
    //           )
    //         )}
    //       </div>
    //     </div>
    //   </div>

      );
    }
  };

  return(
    <div className="container">
          {renderResponses()}
    </div>
  );
  

}

export default Resumo;