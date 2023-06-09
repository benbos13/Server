const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// If your phone has a modern camera 
// you might wanna make this bigger.
app.use(bodyParser.json({ limit: '20mb' }));

// Store the single image in memory.
let latestPhoto = null;

// Upload the latest photo for this session
app.post('/', (req, res) => {
  // Very light error handling
  if(!req.body) return res.sendStatus(400); 

  console.log('got photo')

  // Update the image and respond happily
  latestPhoto = req.body.image;
  console.log(latestPhoto);
  console.log (req.body.comment);
  res.sendStatus(200);
});

// View latest image
app.get('/', (req, res) => {
  // Does this session have an image yet?
  console.log(latestPhoto);
  if(!latestPhoto) {
    return res.status(404).send("Nothing here yet");
  }

  console.log('sending photo');

  try {
    // Send the image
    var img = Buffer.from(latestPhoto, 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img);
  } catch(e) {
    // Log the error and stay alive
    console.log(e);
    return res.sendStatus(500);
  }
});

const port = process.env.PORT || 5005;
app.listen(port);

console.log(`Server listening on ${port}`);