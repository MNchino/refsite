const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/uploadChunk', upload.single('file'), (req, res) => {
  const { file, totalChunks, chunkIndex } = req;
  const { fileName } = req.body;

  // Specify the path to the sibling directory frontend/images
  const filePath = path.join(__dirname, '..', 'frontend', 'src', 'images', fileName);

  // Write the chunk to the file
  fs.appendFileSync(filePath, file.buffer);

  // Send a response indicating success
  res.status(200).send(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded successfully`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});