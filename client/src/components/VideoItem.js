import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';

function VideoItem() {
  const navigate = useNavigate();
  let { fileName } = useParams();
  console.log('fileName:', fileName)
  const filePath = `/api/videoplayer/${fileName}`



  async function handleDelete() {
    const isConfirm = window.confirm("Are you sure whant to delete?");
    if (isConfirm) {
      try {
        let resp = await fetch(`/api/delete/${fileName}`, {
          method: 'DELETE'
        });
        resp = await resp.json();
        navigate('/')
        alert(resp?.message);
      } catch (error) {
        alert(error?.message)
      }

    }
  }

  async function handleUnzip() {
    try {
      let resp = await fetch(`/api/unzip/${fileName}`)
      resp = await resp.json();
      navigate('/')
      alert(resp?.message);
    } catch (error) {
      alert(error?.message)
    }
  }


  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <h3>{fileName}</h3>
      <div className='video-item-button-group'>
        <button className='btn btn-danger' onClick={() => handleDelete()}>Delete</button>
        <button className='btn btn-primary' onClick={() => handleUnzip()}>Unzip</button>
      </div>
      <video src={filePath} controls width={'60%'} />
    </div>
  )
}

export default VideoItem
