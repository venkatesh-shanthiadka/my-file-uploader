import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';

function FileItem({ file, index, pathtype }) {
  let { fileindex } = useParams();

  const onInputChecked = (event) => {
    file.active = event.target.checked
  }

  console.log('file: ', file);
  const urlPath = `/#/files/${index}/paths/${pathtype}`;
  return (
    <div className='file-name-div-container row'>
      <div className='col-2 d-flex'>
        <input type='checkbox' onChange={onInputChecked} />
      </div>
      <div className={`col-9 border-bottom pb-2 ${parseInt(fileindex) === parseInt(index) ? 'text-light bg-dark' : ''}`}>
        <span className='px-2'>{index})</span>
        <a style={{
          color: 'white',
          fontWeight: 'bolder',
          letterSpacing: '0.1rem',
        }} href={urlPath}>
          {file.name}
        </a>
      </div>
    </div>
  )
}

export default FileItem
