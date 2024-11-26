import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TextEditorProps {
    contetText?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ contetText = '' }) => {
  const [content, setContent] = useState<string>('');
  
  useEffect(()=>{
    if(contetText){
        setContent(contetText)
    }
  },[contetText])
  
  return (
    <Editor
      apiKey="p1c0ggbaxkao2lbhnirbxik5qqtaom5mavwi77f96f9q765k"
      value={content}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'lists link',
        ],
        toolbar:
          'bold italic | bullist numlist | link | undo redo | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
        branding: false,
        placeholder: "Insira um texto aqui...",
      }}
      onEditorChange={(newContent) => setContent(newContent)}
    />
  );
};

export default TextEditor;
