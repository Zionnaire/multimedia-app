import React, { useState, useEffect } from 'react';
import { data } from './data';
import { Header } from "./components/Header";
import { AudioPlayer } from './components/AudioPlayer';
import { DocumentViewer } from './components/DocumentViewer';
import { VideoPlayer } from './components/VideoPlayer';
import { ImageViewer } from './components/ImageViewer';
import { Pie, Bar } from 'react-chartjs-2';
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    setMyFiles(data);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortBy = (event) => {
    setSortBy(event.target.value);
  };

  const filteredFiles = myFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFiles = filteredFiles.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "type") {
      return a.type.localeCompare(b.type);
    } else if (sortBy === "date") {
      return new Date(a.date) - new Date(b.date);
    }
    return 0;
  });

  return (
    <>
      <div className="App">
        <Header />
        <div style={styles.container}>
          <div style={{ padding: 10, paddingBottom: 0 }}>
            <p style={{ fontWeight: "bold" }}>My Files</p>
            <p>{selectedFile ? selectedFile.path : filePath}</p>
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
                      };
                    }
                    return file;
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
            style={styles.controlButton}
              type="text"
              placeholder="Search Files"
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
                <p style={{ fontWeight: "bold", marginTop: 10 }}>{selectedFile.name}</p>
                <p>path: <span style={{ fontStyle: "italic" }}>{selectedFile.path}</span></p>
                <p>file type: <span style={{ fontStyle: "italic" }}>{selectedFile.type}</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
 
const styles = {
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
  borderLeft: '1px solid #000'
 },
 controlTools: {
  display: 'flex',
  gap: '10px',
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
},

 controlButton: {
  padding: '10px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
 },

 
};

