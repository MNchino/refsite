import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import axios from 'axios';

import { DropzoneArea } from 'react-mui-dropzone';

const DropzoneButton = () => {
  const handleDrop = (files) => {
    //TODO - CHANGE FOR MULTIPLE
    const file = files[0];

    if (file) {
      saveToFileOnServer(file);
    }
  };  

  const saveToFileOnServer = async (file) => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const chunkSize = 1024 * 1024; // 1 MB chunks (adjust as needed)
    const totalChunks = Math.ceil(file.size / chunkSize);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('file', chunk);
      formData.append('fileName', file.name);
      formData.append('totalChunks', totalChunks);
      formData.append('chunkIndex', chunkIndex);

      try {
        await axios.post('http://localhost:3001/uploadChunk', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log(`Chunk ${chunkIndex + 1} uploaded successfully`);
      } catch (error) {
        console.error('Error uploading chunk:', error.message);
        // Handle error and retry or stop uploading
        break;
      }
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Dropzone Button
      </Typography>
      <DropzoneArea
        dropzoneText="Drag and drop a file here or click"
        showAlerts={false}
        filesLimit={1}
        onChange={handleDrop}
        showPreviewsInDropzone={false}
      />
    </div>
  );
};

export default DropzoneButton;
