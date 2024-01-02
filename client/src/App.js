import React from 'react';
import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import VideoItem from './components/VideoItem';
import FileList from './components/FileList';


function App() {

  return (
    <div className='container-fluid h-100'>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/files/:fileindex/paths/:pathtype" element={<FileList />} />
          <Route exact path="/video/:fileName" element={<VideoItem />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
