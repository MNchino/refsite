const sharp = require("sharp")
const INPUT_path_to_your_images = "src/images/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}";
const OUTPUT_path = "src/compressed_images/";
const fs = require('fs');
const path = require('path');
const glob = require("glob")


const directory = OUTPUT_path;

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
  }
});

glob(INPUT_path_to_your_images, function (err, files) {
  if (err != null) { throw err; }
  fs.mkdirSync(OUTPUT_path, { recursive: true });
  files.forEach(function(inputFile) {
  sharp(inputFile)
    .resize(398,398)
    .jpeg({ mozjpeg: true, quality: 60, force: true })
    .toFile(path.join(OUTPUT_path, path.basename(inputFile, path.extname(inputFile))+'.jpg'), (err, info) => {
      if(err !== null){
        throw err
      }
    });
  });
});