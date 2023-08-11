const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const json = express.json()
const PORT = 3017
const AWS = require('aws-sdk')
var cors = require("cors")

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
require('dotenv').config()

AWS.config.update({region: 'us-east-1'})

app.use(json)
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024},
}))


s3 = new AWS.S3({
    credentials:{
        maxRetries: 3,
        httpOptions: {timeout: 30000, connectTimeout: 5000},
        accessKeyId: 'AKIAUTSGTB62IJ3Z6PQS',
        secretAccessKey: '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'
    }
})

app.use(cors({
    origin: "*",
  }))
app.post('/', async (req, res) => {
    const { files } = req
    const uploadParams = {
        Bucket: 'capit-finance-images',
        Key: files.file.name,
        Body: Buffer.from(files.file.data),
        ContentType: files.file.mimetype,
        ACL: 'public-read'
    }

    s3.upload(uploadParams, function(err, data){
        err && console.log("Error", err)
        data && console.log("Upload Success", data.Location)
    })

    res.send('yes uploaded')
})

app.get('/healthcheck', (req, res) => {
    res.send('<h1 style="color:green">server running</h1>')
})


app.listen(PORT, function(){ console.log(`port started in ${PORT}`)})

