import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardPrimaryAction, CardAction, CardActions } from 'rmwc/Card';
import { ListDivider } from 'rmwc/List';
import { Person } from '../svg';

const css = {
  row: {
    display: 'flex',
    padding: '1rem',
  },
  image: {
    borderRadius: '50%',
    height: '3rem',
    width: '3rem',
    margin: '0 1rem',
  },
  title: {
    fontWeight: '500',
    margin: '0',
  },
  description: {
    margin: '0',
  },
};

export default function NotesList({ notes }) {
  return (
    <Card className="notes-list">
      {notes.map(note => {
        return (
          <div key={note.__id}>
            <Link to={`/note/${note.__id}`}>
              <CardPrimaryAction ripple={false}>
                <div style={css.row}>
                  {note.photoURL ? (
                    <img
                      src={note.photoURL}
                      alt={note.displayName}
                      style={css.image}
                    />
                  ) : (
                    <Person className="avatar" style={css.image} />
                  )}
                  <div>
                    <h2 style={css.title}>{note.title}</h2>
                    <p style={css.description}>{note.description}</p>
                  </div>
                </div>
              </CardPrimaryAction>
            </Link>
            <ListDivider />
          </div>
        );
      })}
    </Card>
  );
}
