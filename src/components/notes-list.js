import React from 'react';
import { Card } from 'rmwc/Card';
import Note from './note';

export default function NotesList({ currentUser, notes }) {
  return (
    <Card className="notes-list">
      {notes.sort(notesSort).map((note, i) => <Note currentUser={currentUser} note={note} key={i} />)}
    </Card>
  );
}

function notesSort(a, b) {
  let result = sortByFavorite(a, b);

  if (result == 0) {
    result = sortByTitle(a, b);
  }

  return result;
}

function sortByFavorite(a, b) {
  return a.isFavorite == b.isFavorite ? 0 : b.isFavorite ? 1 : -1;
}

function sortByTitle(a, b) {
  return a.title == b.title
    ? 0
    : a.title.toLowerCase() > b.title.toLowerCase()
      ? 1
      : -1;
}
