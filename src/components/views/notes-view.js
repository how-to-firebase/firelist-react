import React from 'react';
import { connect } from 'unistore/react';
import { actions } from '../../store';
import { Fab } from 'rmwc/Fab';
import { NoteAdd } from '../../svg';
import { Link } from 'react-router-dom';
import NotesList from '../notes-list';

const css = {
  fab: {
    position: 'absolute',
    bottom: '2rem',
    right: '2rem',
  },
};

export default connect('notes', actions)(({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <NotesList notes={notes} />
      <Link to="/note-add" style={css.fab} tabIndex="-1">
        <Fab ripple={false} tabIndex="1">
          <NoteAdd />
        </Fab>
      </Link>
    </div>
  );
});
