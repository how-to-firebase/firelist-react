import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardPrimaryAction, CardAction, CardActions } from 'rmwc/Card';
import { ListDivider } from 'rmwc/List';
import { Button } from 'rmwc/Button';
import { Delete, Person } from '../svg';
import { removeNote } from '../database';

const css = {
  row: {
    display: 'flex',
    padding: '1rem',
    alignItems: 'center',
  },
  image: {
    borderRadius: '50%',
    height: '3rem',
    width: '3rem',
    margin: '0 1rem',
  },
  centerBlock: {
    flexGrow: '1',
  },
  title: {
    fontWeight: '500',
    margin: '0',
  },
  description: {
    margin: '0',
  },
  icon: {
    borderRadius: '50%',
    height: '2rem',
    width: '2rem',
    margin: '0 1rem',
  },
};

export default function NotesList({ notes }) {
  return (
    <Card className="notes-list">
      {notes.map(note => {
        return (
          <div key={note.__id}>
            <Link
              to={`/note/${note.__id}`}
              hover-target="true"
              focus-target="true"
            >
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
                  <div style={css.centerBlock}>
                    <h2 style={css.title}>{note.title}</h2>
                    <p style={css.description}>{note.description}</p>
                  </div>

                  <Button
                    ripple={false}
                    onClick={handleClick(note.__id)}
                    show-on-hover="true"
                    show-on-focus="true"
                  >
                    <Delete style={css.icon} />
                  </Button>
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

function handleClick(noteId) {
  return e => {
    e.preventDefault();
    e.stopPropagation();
    removeNote(noteId);
  };
}
