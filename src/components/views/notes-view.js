import React from 'react';
import { connect } from 'unistore/react';
import { actions } from '../../store';
import { Fab } from 'rmwc/Fab';
import { NoteAdd } from '../../svg';
import { Link } from 'react-router-dom';
import NotesList from '../notes-list';

const css = {
  fab: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
  },
};

export default connect('currentUser,collaborativeNotes,notes', actions)(
  ({ currentUser, collaborativeNotes, notes }) => {
    return (
      <div>
        {!!notes.length && (
          <div>
            <h1>My Notes</h1>
            <NotesList currentUser={currentUser} notes={notes} />
          </div>
        )}
        {!!collaborativeNotes.length && (
          <div>
            <h1>Collaborative Notes</h1>
            <NotesList currentUser={currentUser} notes={collaborativeNotes} />
          </div>
        )}
        <Link to="/note-add" style={css.fab} tabIndex="-1">
          <Fab ripple={false} tabIndex="1">
            <NoteAdd />
          </Fab>
        </Link>
      </div>
    );
  }
);
