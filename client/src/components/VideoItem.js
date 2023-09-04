import React from 'react'
import { useParams } from 'react-router-dom';

function VideoItem(props) {
  let { fileName } = useParams();
  console.log('fileName:', fileName)
  const filePath = `/api/videoplayer/${fileName}`
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <h2>{fileName}</h2>
      <video src={filePath} controls width={'60%'}></video>
    </div>
  )
}

export default VideoItem
