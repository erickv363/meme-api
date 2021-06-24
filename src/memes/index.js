const admin = require('firebase-admin')
const serviceAccount = require('../../credentials.json')

function connectFirestore(){
  if(!admin.apps.length){
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
}
return admin.firestore()
}

exports.getMemes = (req, res) => {
  const db = connectFirestore()
  db.collection('memes').get()
    .then(collection => {
      const memes = collection.docs.map(doc => {
        let thisMeme = doc.data()
        thisMeme.id = doc.id
        return thisMeme
      })
    res.send(memes)
    })
    .catch(err => {
      console.error('Error getting memes: ', err)
      res.status(500).send(err.message)
    })   
}

exports.createMeme = (req, res) => {
  // check if valid request, otherwise send error
  if(!req.body || !req.body.imageUrl || !req.body.title || !req.body.creator) {
    res.status(400).send('Invaild request')
  }
  const db = connectFirestore()
  const newMeme = {
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    creator: req.body.creator,
    tags: req.body.tags || [],
  }
  db.collection('memes').add(req.body)
    .then(() => res/status(201).send("created"))
    .catch(err => {
      console.log('Error creating meme: ', err.message)
      res.status(500).send(err)
    })
}

exports.updateMeme = (req, res) => {
  if(!req.body || !req.params.memeId) {
    res.status(401).send('Invalid request')
  }
  const db = connectFirestore()
  db.collection('memes').doc(req.params.memeId).update(req.body)
  .then(() => res.send(202).send('updated'))
  .catch(err => {
    console.log ('Error updating meme: ', err.message)
    res.status(500).send(err)
  })
}

exports.deleteMeme = (req, res) => {
  if(!req.params.memeId) {
    res.status(401).send('Invaild request')
  }
  const db = connectFirestore()
  db.collection('memes').doc(req.params.memeId).delete()
  .then(() => res.status(203).send('deleted'))
  .catch(err => {
    console.log('Error deleting meme: ', err.message)
    res.status(500).send(err)
  })
}