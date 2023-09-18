import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FileItem from './FileItem';
import VideoItem from './VideoItem';

function FileList() {

  const [filesList, setFilesList] = useState([]);
  let { pathtype, fileindex } = useParams();

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    const resp = await fetch(`/api/files/${pathtype}`);
    const resp1 = await resp.json();
    setFilesList(resp1?.files || [])
    console.log('resp1', resp1);
  }


  return (
    <>
      <div className='row'>
        <div className='col-12 d-flex justify-content-end align-items-center'>
          <button className='btn btn-outline-secondary mx-2' >Zip and send</button>
          <span className='mx-2'>Total files : {filesList.length}</span>
        </div>
      </div>
      <div className='row'>
        <div className='col-2'>
          {
            filesList.map((file, index) => {
              return (
                <>
                  <FileItem file={file} index={index} pathtype={pathtype} />
                </>
              )
            })
          }
        </div>
        <div className='col-10'>
          {filesList.length > 0 && <VideoItem 
          file={filesList[parseInt(fileindex)]}
          pathtype={pathtype} />}
        </div>
      </div>
    </>
  )
}

export default FileList
