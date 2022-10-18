const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const notesList = require('./db/db.json');
const uuid = require('./helpers/uuid')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(notesList.slice(1));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

function createNote(body, notesArray) {
    const createdNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(createdNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return createdNote;
}

app.post('/api/notes', (req, res) => {
    const createdNote = createNote(req.body, notesList);
    res.json(createdNote);
    req.body.id = uuid();
});

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile("./db/db.json", function (err, result) {
    const oldNote = JSON.parse(result);

    const updatedNotes = [];
    for (let i = 0; i < oldNote.length; i++) {
      const element = oldNote[i];

      if (oldNote[i].id != req.params.id) {
        updatedNotes.push(oldNote[i])
      }
    }
    fs.writeFile("./db/db.json", JSON.stringify(updatedNotes), (err, result) => { res.json(updatedNotes) })
  })

})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});