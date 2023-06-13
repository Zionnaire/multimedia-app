import React, {useState, useEffect} from 'react';
import { AudioPlayer } from './AudioPlayer';
import { DocumentViewer } from './DocumentViewer';
import { VideoPlayer } from './VideoPlayer';
import { ImageViewer } from './ImageViewer';
import { PDFViewer } from './PDFViewer';
import { data } from '../data';


export const FilePreview = ({ file, onClose }) => {
  const { type, name, path } = file;
  const [myFiles, setMyFiles] = useState([]);

  useEffect(() => {
    setMyFiles(data);
  }, []);

  const renderPreview = () => {
    switch (type) {
      case 'video':
        return <VideoPlayer path={path} />;
      case 'audio':
        return <AudioPlayer path={path} />;
      case 'document':
        return <DocumentViewer path={path} />;
      case 'image':
        return <ImageViewer path={path} />;
      case 'pdf':
        return <PDFViewer path={path} />;
      default:
        return null;
    }
  };



  return (
    <div>
      <h2>File Preview: {name}</h2>
      {renderPreview()}
      <button onClick={onClose}>Close</button>
    </div>
  );
};


