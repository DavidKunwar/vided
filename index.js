const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
}))
app.use(express.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

app.get('/', function(req, res){
    res.send("Hello World")
})

// Keeping track of renderID
let renderId = ""

// Edit Data
const data = JSON.stringify({
  "timeline": {
    "soundtrack": {
      "src": "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/freepd/motions.mp3",
      "effect": "fadeOut"
    },
    "background": "#000000",
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "html",
              "html": "<p data-html-type=\"text\">DAVID &nbsp;&nbsp;&nbsp; KUNWAR</p>",
              "css": "p { color: #ffffff; font-size: 22px; font-family: Work Sans Light; text-align: center; }",
              "width": 362,
              "height": 60
            },
            "start": 4,
            "length": 11,
            "transition": {
              "in": "fade",
              "out": "fade"
            },
            "fit": "none",
            "scale": 1,
            "offset": {
              "x": -0.225,
              "y": 0
            },
            "position": "center",
            "effect": "zoomIn"
          }
        ]
      },
      {
        "clips": [
          {
            "asset": {
              "type": "video",
              "src": "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/footage/earth.mp4",
              "trim": 5
            },
            "start": 0,
            "length": 15,
            "transition": {
              "in": "fade",
              "out": "fade"
            },
            "offset": {
              "x": 0,
              "y": 0
            },
            "position": "center"
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "size": {
      "width": 1280,
      "height": 720
    }
  }
});


app.post('/edit', function(req, res){
    // Edit call to Shotstack API
    const config = {
        method: 'post',
        url: 'https://api.shotstack.io/stage/render',
        headers: { 
        'content-type': 'application/json', 
        'x-api-key': 'LmgfswxBy75bgERGVHROi3V1Y9q5XmfQ9DDluika'
        },
        data: data
    };
  
    axios(config)
    .then(function (response) {
        renderId = response.data.response.id
        console.log(JSON.stringify(response.data, null, 2));
    })
    .catch(function (error) {
        console.log(error);
    });

    res.send('done')
})


app.post('/get-status', function(req, res){
    const config = {
        method: 'get',
        url: `https://api.shotstack.io/stage/render/${renderId}`,
        headers: { 
            'content-type': 'application/json', 
            'x-api-key': 'LmgfswxBy75bgERGVHROi3V1Y9q5XmfQ9DDluika'
          },
    }

    axios(config)
    .then(function(response){
        console.log(JSON.stringify(response.data, null, 2))
    }).catch(function(error){
        console.log(error)
    })

    res.send('done')
})


app.post('/get-edit', function(req, res){
    const config = {
        method: 'get',
        url: `https://api.shotstack.io/serve/stage/assets/render/${renderId}`,
        headers: { 
            'content-type': 'application/json', 
            'x-api-key': 'LmgfswxBy75bgERGVHROi3V1Y9q5XmfQ9DDluika'
          },
    }

    axios(config)
    .then(function(response){
        console.log(JSON.stringify(response.data, null, 2))
    }).catch(function(error){
        console.log(error)
    })

    res.send('done')
})




app.listen(3001, function(req, res){
    console.log('Server Running on PORT : 3001')
})