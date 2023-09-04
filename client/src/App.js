import React from 'react';
import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import VideoItem from './components/VideoItem';


function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/video/:fileName" element={<VideoItem />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
