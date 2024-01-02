import React from 'react'
import { getValidHost } from '../utils/helper';
import { useParams, useNavigate } from 'react-router-dom';
import useWindowDimensions from '../hooks/useWindowDimensions';

function VideoItem({ file, pathtype }) {
  console.log('File: ', file)
  const navigate = useNavigate();
  const filePath = `${getValidHost[pathtype]}/api/videoplayer/${file.name}/paths/${pathtype}`
  const { height, width } = useWindowDimensions();



  async function handleDelete() {
    const isConfirm = window.confirm("Are you sure whant to delete?");
    if (isConfirm) {
      try {
        let resp = await fetch(`/api/delete/${file.name}`, {
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
      let resp = await fetch(`/api/unzip/${file.name}`)
      resp = await resp.json();
      navigate('/')
      alert(resp?.message);
    } catch (error) {
      alert(error?.message)
    }
  }


  return (
    <>
      {/* <h3>{fileName}</h3> */}
      {/* <div className='video-item-button-group'>
        <button className='btn btn-danger' onClick={() => handleDelete()}>Delete</button>
        <button className='btn btn-primary' onClick={() => handleUnzip()}>Unzip</button>
      </div> */}
      <video src={filePath} controls height={'100%'} width={'100%'} />
    </>
  )
}

export default VideoItem
