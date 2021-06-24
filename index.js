const express = require('express')
const cors = require('cors')
const { getMemes, createMeme, updateMeme, deleteMeme } = require('./src/memes')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/memes', getMemes)
app.post('/memes', createMeme)
app.patch('/memes/:memeId', updateMeme)
app.delete('/memes/:memeId', deleteMeme)

app.listen(3000, ()=>{
    console.log('Listening to http://localhost:3000')
})
