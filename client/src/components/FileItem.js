import React from 'react'

function FileItem({ file, index, pathtype }) {

  const onInputChecked  = (event) =>{
  file.active = event.target.checked
  }

  console.log('file: ', file);
  const urlPath = `/#/files/${index}/paths/${pathtype}`;
  return (
    <div className='file-name-div-container row'>
      <div className='col-2 d-flex'>
        <input type='checkbox' onChange={onInputChecked} />
      </div>
      <div className='col-9 border-bottom pb-2'>
        <span className='px-2'>{index + 1}</span>
        <a href={urlPath}>
          {file.name}
        </a>
      </div>
    </div>
  )
}

export default FileItem
