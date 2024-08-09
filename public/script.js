const socket = io();
const noteInput = document.getElementById('noteInput');
const addNoteButton = document.getElementById('addNoteButton');
const notesList = document.getElementById('notesList');
const toggleDarkModeButton = document.getElementById('toggleDarkMode');

let isDarkMode = false;

addNoteButton.addEventListener('click', () => {
    const noteText = noteInput.value;
    if (noteText) {
        socket.emit('addNote', noteText);
        noteInput.value = '';
    }
});

toggleDarkModeButton.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
});

socket.on('loadNotes', (notes) => {
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        addNoteToList(note, index);
    });
});

socket.on('noteAdded', (note) => {
    addNoteToList(note, notesList.children.length);
});

socket.on('noteDeleted', (index) => {
    notesList.removeChild(notesList.children[index]);
});

socket.on('noteUpdated', ({ index, newNote }) => {
    notesList.children[index].querySelector('span').innerText = newNote;
});

function addNoteToList(note, index) {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.innerHTML = `
        <span>${note}</span>
        <button onclick="deleteNote(${index})">Supprimer</button>
        <button onclick="editNote(${index})">Modifier</button>
    `;
    notesList.appendChild(noteElement);
}

function deleteNote(index) {
    socket.emit('deleteNote', index);
}

function editNote(index) {
    const newNote = prompt("Modifier la note:", notesList.children[index].querySelector('span').innerText);
    if (newNote) {
        socket.emit('updateNote', { index, newNote });
    }
}
