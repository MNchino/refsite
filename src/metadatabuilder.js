const INPUT_path_to_your_images = "src/images/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}";
const OUTPUT_path = "src/metadata.json";
const fs = require('fs');
const glob = require("glob")

function cutName(name)
{
  var temp = name.match("[^\/]+$");
  temp = ("").concat(temp);
  const nextPivot = temp.indexOf("@")
  temp = temp.substr(0, nextPivot)
  return temp;
};

function cutTwitter(name)
{
  var temp = name.match("[^\/]+$");
  temp = ("").concat(temp);
  if (temp.indexOf("@_tw") < 0)
    return null
  const pivot = temp.indexOf("@_tw")
  const nextPivot = temp.indexOf("@", pivot + 3)
  if (pivot + 4 === nextPivot)
  {
    return "same"
  }
  return temp.substr(pivot + 4).split('@')[0];
}

function cutArtist(name)
{
  var temp = name.match("[^\/]+$");
  temp = ("").concat(temp);
  temp = temp.substr(temp.lastIndexOf("@") + 1)
  temp = temp.substr(0, temp.indexOf("."))
  return temp;
}

const data = {}
glob.sync(INPUT_path_to_your_images).map((inputFile) => {
    const newFileName = inputFile.replace(/@.*(?=\.)/g, '')
    data[newFileName] = {
      path: newFileName,
      date: fs.statSync(inputFile).birthtime,
      name: cutName(inputFile),
      artist: cutArtist(inputFile),
      twitter: cutTwitter(inputFile),
    }
});
console.log(data)

fs.existsSync(OUTPUT_path, function(exists) {
  if(exists) {
      console.log('deleting old metadata.,json');
      fs.unlinkSync(OUTPUT_path);
  } else {
      console.log('metadata.json not found, creating new one.');
  }
});
fs.writeFileSync (OUTPUT_path, JSON.stringify(data), function(err) {
  if (err) throw err;
  console.log('metadata migration complete');
  }
);

//TODO: FIX TWITTER PARSER,
//TODO: CREATE WEBPAGE THAT CREATES THIS METADATA ON UPLOAD.