import React from 'react';
import { Link } from 'react-router-dom';
import { CardPrimaryAction, CardAction, CardActions } from 'rmwc/Card';
import { ListDivider } from 'rmwc/List';
import { Button } from 'rmwc/Button';
import { IconToggle } from 'rmwc/IconToggle';

import Date from './date';
import { DateRange, LocationCity, StarRate, Person } from '../svg';
import { updateNote } from '../database';
import { deleteFalsyValues } from '../utilities';

const css = {
  row: {
    display: 'flex',
    padding: '1rem',
    alignItems: 'start',
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
    margin: '0 0 1rem',
  },
  detail: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '.75rem',
    margin: '0',
  },
  detailIcon: {
    width: '1rem',
    margin: '-1px 1rem 0 0',
  },
  icon: {
    borderRadius: '50%',
    height: '2rem',
    width: '2rem',
    margin: '0 1rem',
  },
};

export default ({ note }) => {
  return (
    <div>
      <Link to={`/note/${note.__id}`} hover-target="true" focus-target="true">
        <CardPrimaryAction ripple={false}>
          <div style={css.row}>
            <div>
              {note.photoURL ? (
                <img
                  src={note.photoURL}
                  alt={note.displayName}
                  style={css.image}
                />
              ) : (
                <Person className="avatar" style={css.image} />
              )}
            </div>
            <div style={css.centerBlock}>
              <h2 style={css.title}>{note.title}</h2>
              <p style={css.description}>{note.description}</p>
              <p style={css.detail} hidden={!note.dueDate}>
                <DateRange style={css.detailIcon} />
                <Date date={note.dueDate} />
              </p>
              <p style={css.detail} hidden={!note.location}>
                <LocationCity style={css.detailIcon} />
                <span>{note.location}</span>
              </p>
            </div>
            <IconToggle onClick={toggleFavorite(note)}>
              <StarRate is-active={(note.isFavorite && 'true') || 'false'} />
            </IconToggle>
          </div>
        </CardPrimaryAction>
      </Link>
      <ListDivider />
    </div>
  );
};

function toggleFavorite({ __id: noteId, isFavorite }) {
  return e => {
    const updates = deleteFalsyValues({ isFavorite: !isFavorite });

    e.preventDefault();

    updateNote(noteId, updates);
  };
}
