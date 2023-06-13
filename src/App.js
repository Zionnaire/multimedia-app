import React, { useState, useEffect } from 'react';
import { data } from './data';
import { Header } from "./components/Header";
import { AudioPlayer } from './components/AudioPlayer';
import { DocumentViewer } from './components/DocumentViewer';
import { VideoPlayer } from './components/VideoPlayer';
import { ImageViewer } from './components/ImageViewer';
import { Pie, Bar } from 'react-chartjs-2';
import { v4 as uuidv4 } from 'uuid';
import { PDFViewer } from './components/PDFViewer';
import { FilePreview } from './components/FilePreview'; // New component for file preview

import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 ArcElement,
 Tooltip,
 Legend
} from 'chart.js';
ChartJS.register(
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 Legend,
 ArcElement
);



export default function App() {
  const [myFiles, setMyFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePath, setFilePath] = useState("/file-server/");
  const [showChartModal, setShowChartModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [fileToUpload, setFileToUpload] = useState(null);

  useEffect(() => {
    setMyFiles(data);
  }, []);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const newFile = {
      id: uuidv4(),
      name: file.name,
      path: URL.createObjectURL(file),
      type: file.type.split('/')[0],
      date: new Date().toISOString(),
    };

    // Update the data array in data.js by creating a new array with existing data and the new file
    const updatedData = [...data, newFile];

    // Replace the original data array with the updated array
    data.length = 0;
    Array.prototype.push.apply(data, updatedData);

    setMyFiles(prevFiles => [...prevFiles, newFile]);
    setFileToUpload(null);
  }
};


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortBy = (event) => {
    setSortBy(event.target.value);
  };

  const filteredFiles = myFiles.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFiles = filteredFiles.sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'type') {
      return a.type.localeCompare(b.type);
    } else if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    }
  });
  var barChartOptions = {
    responsive: true,
    plugins: {
     legend: {
      position: 'top',
     },
     title: {
      display: true,
      text: 'Files Breakdown',
     },
    },
   };

  return (
    <>
    {showChartModal && (
    <div style={styles.modal}>
     <div style={styles.modalContent}>
      <div style={styles.modalHeader}>
       <p style={{ fontWeight: "bold" }}>Files Breakdown</p>
       <button style={styles.closeButton} onClick={() => setShowChartModal(false)}>close</button>
      </div>
      <div style={styles.modalBody}>
       <Pie
        data={{
         labels: ['Video', 'Audio', 'Document', 'Image'],
         datasets: [
          {
           label: 'Files Breakdown',
           data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
           backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
           ],
           borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
           ],
           borderWidth: 1,
          },
         ],
        }}
       />
       <Bar
        data={{
         labels: ['Video', 'Audio', 'Document', 'Image'],
         datasets: [
          {
           label: 'Files Breakdown',
           data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
           backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
           ],
           borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
           ],
           borderWidth: 1,
          },
         ],
        }}
        options={barChartOptions}
       />
      </div>
     </div>
    </div>
   )}
      <div className="App">
        <Header />
        <div style={styles.container}>
          <div style={{ padding: 10, paddingBottom: 0 }}>
            <p style={{ fontWeight: "bold" }}>My Files</p>
            <p>{selectedFile ? selectedFile.path : filePath}</p>
            <input type="file" onChange={handleFileUpload} />
          </div>
          <div  style={styles.container}>
        {myFiles.map(file => (
          <div style={styles.con} key={file.id}>
            <p>{file.name}</p>
            <button onClick={() => setSelectedFile(file)}>Preview</button>
          </div>
        ))}
      </div>
      {selectedFile && (
        <FilePreview
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
          <div style={styles.controlTools}>
            
            <button
              style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  const newFiles = myFiles.map(file => {
                    if (file.id === selectedFile.id) {
                      return {
                        ...file,
                        name: prompt("Enter new name")
                      }
                    }
                    return file
                  });
                  setMyFiles(newFiles);
                  setSelectedFile(null);
                }
              }}
            >
              Rename
            </button>
            <button
              style={styles.controlButton}
              onClick={() => {
                setShowChartModal(true);
              }}
            >
              Files Breakdown
            </button>
            <button
              style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  window.open(selectedFile.path, "_blank");
                }
              }}
            >
              Download
            </button>
            <button
              style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  const newFiles = myFiles.filter(file => file.id !== selectedFile.id);
                  setMyFiles(newFiles);
                  setSelectedFile(null);
                }
              }}
            >
              Delete
            </button>
            <input
              type="file"
              accept="image/*, audio/*, video/*, .pdf"
              style={{ display: "none" }}
              ref={inputRef => setFileToUpload(inputRef)}
              onChange={handleFileUpload}
            />
            <button
              style={styles.controlButton}
              onClick={() => {
                if (fileToUpload) {
                  fileToUpload.click();
                }
              }}
            >
              Upload
            </button>
          </div>
          <div style={styles.searchBar}>
            <input
            style={styles.controlButton}
              type="text"
              placeholder="Search files"
              value={searchTerm}
              onChange={handleSearch}
            />
            <select style={styles.controlButton} value={sortBy} onChange={handleSortBy}>
              <option value="name">Sort by Name</option>
              <option value="type">Sort by Type</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
          <div style={styles.fileContainer}>
            <div style={{ width: "100%", padding: 10 }}>
              {sortedFiles.map((file) => {
                if (file.path.slice(0, filePath.length) === filePath) {
                  return (
                    <div
                      style={styles.file}
                      className="files"
                      key={file.id}
                      onClick={() => {
                        if (selectedFile && selectedFile.id === file.id) {
                          setSelectedFile(null);
                          return;
                        }
                        setSelectedFile(file);
                      }}
                    >
                      <p>{file.name}</p>
                    </div>
                  );
                }
              })}
            </div>
            {selectedFile && (
              <div style={styles.fileViewer}>
                {selectedFile.type === 'video' && (
                  <VideoPlayer path={selectedFile.path} />
                )}
                {selectedFile.type === 'audio' && (
                  <AudioPlayer path={selectedFile.path} />
                )}
                {selectedFile.type === 'document' && (
                  <DocumentViewer path={selectedFile.path} />
                )}
                {selectedFile.type === 'image' && (
                  <ImageViewer path={selectedFile.path} />
                )}
                {selectedFile.type === 'pdf' && (
                  <PDFViewer path={selectedFile.path} />
                )}
                <p style={{ fontWeight: "bold", marginTop: 10 }}>
                  {selectedFile.name}
                </p>
                <p>
                  path:{" "}
                  <span style={{ fontStyle: "italic" }}>
                    {selectedFile.path}
                  </span>
                </p>
                <p>
                  file type:{" "}
                  <span style={{ fontStyle: "italic" }}>
                    {selectedFile.type}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
    </>
  );
}

const styles = {

  con:{
display: 'flex',
padding: '5px',
justifyContent: 'space-between',

  },
  container: {
    backgroundColor: '#fff',
    color: '#000',
  },
  fileContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  file: {
    backgroundColor: '#eee',
    padding: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
    width: '100%',
  },
  fileViewer: {
    padding: '10px',
    margin: '10px',
    width: '30vw',
    height: '100vh',
    cursor: 'pointer',
    borderLeft: '1px solid #000',
  },
  controlTools: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '10px',
  },
  controlButton: {
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  searchBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '10px',
  },
  // modal
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    height: '50vh',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  modalClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '10px',
    cursor: 'pointer',
  },
  modalBody:{
    width: '100%',
    height: '90%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '10px',
  },
  modalHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  closeButton: {
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: '#eee',
  }
};