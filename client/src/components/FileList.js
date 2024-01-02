import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FileItem from './FileItem';
import VideoItem from './VideoItem';
import axios from 'axios';
import { getValidHost } from '../utils/helper';

function FileList() {

  const [filesList, setFilesList] = useState([]);
  let { pathtype, fileindex } = useParams();

  useEffect(() => {
    fetchFiles();
  }, [pathtype]);

  async function fetchFiles() {
    const url = `${getValidHost[pathtype]}/api/files/${pathtype}`;
    const resp = await fetch(url);
    const resp1 = await resp.json();
    setFilesList(resp1?.files || [])
    console.log('resp1', resp1);
  }

  const registerJob = async () => {
    try {
      const requestData = filesList.filter(i => i.active).map(i => i.name)
      console.log('requestData: ', requestData)
      const url = `/api/jobs/register`
      const request_config = {
        method: "post",
        url,
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          files: requestData,
          pathType: "input",
          jobType: "ZIP_ORIGINAL_FILE,UPLOAD_ZIPPED_FILE,UNZIP_ZIPPED_FILE,DELETE_ZIPPED_FILE,DELETE_ORIGINAL_FILE"
        }
      };
      const resp = await axios(request_config);
      console.log('resp: ', resp);
      alert('Job registered')
    } catch (error) {
      alert(`registerJob: ${error?.message}`)
    }
  }

  return (
    <>
      <div className='row' style={{height: '5dvh'}}>
        <div className='col-12 d-flex justify-content-end align-items-center'>
          {pathtype === 'input' && <button className='btn btn-outline-secondary mx-2' onClick={registerJob}>Zip and send</button>}
          <span className='mx-2'>Total files : {filesList.length}</span>
        </div>
      </div>
      <div className='row' style={{height: "95dvh"}}>
        <div className='col-2 h-100' style={{ overflowY: 'scroll' }}>
          {
            filesList.map((file, index) => {
              file.active = false;
              return (
                <>
                  <FileItem file={file} index={index} pathtype={pathtype} />
                </>
              )
            })
          }
        </div>
        <div className='col-10 h-100' style={{ overflowY: 'hidden' }}>
          {filesList.length > 0 && <VideoItem 
          file={filesList[parseInt(fileindex)]}
          pathtype={pathtype} style={{ height: 'inherit'}} />}
        </div>
      </div>
    </>
  )
}

export default FileList
