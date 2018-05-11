import React from 'react';
import { actions } from '../../store';
import { connect } from 'unistore/react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Button } from 'rmwc/Button';
import { FormField } from 'rmwc/FormField';
import { TextField } from 'rmwc/TextField';
import { ChipSet, Chip } from 'rmwc/Chip';

import 'react-dates/initialize';
import { DayPickerSingleDateController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import { pick } from 'lodash';
import moment from 'moment';
import { getNoteObservable, removeNote, updateNote } from '../../database';
import FileUpload from '../file-upload';
import Images from '../images';
import {
  deleteEmptyValues,
  isDirty,
  omitEmptyValues,
  parseTags,
} from '../../utilities';

const css = {
  buttons: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  button: {
    marginLeft: '1rem',
  },
  hidden: {
    display: 'none',
  },
};

export class NoteView extends React.Component {
  constructor() {
    super();
    this.state = this.defaultState;
  }

  get defaultState() {
    return {
      title: '',
      description: '',
      dueDate: null,
      location: '',
      tags: '',
      images: {},
      serverNote: null,
      loaded: false,
    };
  }

  get isValid() {
    return this.state.title.length;
  }

  get isDirty() {
    const keys = ['title', 'description', 'dueDate', 'location', 'tags'];
    const serverNote = pick(this.state.serverNote, keys);
    const note = omitEmptyValues(pick(this.state, keys));

    return isDirty(note, serverNote);
  }

  componentDidMount() {
    const { noteId } = this.props;
    this.noteSubscription = getNoteObservable(noteId).subscribe(note => {
      if (note.dueDate) {
        note.dueDate = moment(note.dueDate);
      }

      this.setState({ serverNote: note, loaded: true, ...note });
    });
  }

  componentWillUnmount() {
    this.noteSubscription.unsubscribe();
  }

  handleTitle(e) {
    this.setState({ title: e.target.value });
  }

  handleDescription(e) {
    this.setState({ description: e.target.value });
  }

  genericHandler(name) {
    return e => this.setState({ [name]: e.target.value });
  }

  handleDueDateChange() {
    return dueDate => this.setState({ dueDate });
  }

  handleDueDateFocus() {
    return ({ focused }) => this.setState({ focused });
  }

  removeDueDate() {
    return () => this.setState({ dueDate: null });
  }

  handleKeyPress() {
    return ({ key }) => key == 'Enter' && this.submit();
  }

  removeNote() {
    return async e => {
      e.preventDefault();
      await removeNote(this.state.__id);
      this.setState({ redirect: true });
    };
  }

  handleUpload() {
    return ({ file, src }) => {
      const images = { ...this.state.images };
      
      images[file.name] = {
        downloadURL: src,
        filename: file.name,
      };
      this.setState({ images });
    };
  }

  async submit(e) {
    if (this.isValid) {
      const { title, description, dueDate, location, tags } = this.state;
      const { noteId } = this.props;

      e && e.preventDefault();

      const updates = deleteEmptyValues({
        title,
        description,
        dueDate: (dueDate && dueDate.toString()) || null,
        location,
        tags,
      });
      return updateNote(noteId, updates);
    }
  }

  render() {
    const { redirect } = this.state;
    return redirect ? (
      <Redirect to="/notes" />
    ) : (
      <form
        onSubmit={this.submit.bind(this)}
        onKeyPress={this.handleKeyPress()}
      >
        <FormField>
          <label style={css.hidden}>edit {this.state.title}</label>
          <ul>
            <li>
              <TextField
                label="Title"
                value={this.state.title}
                onChange={this.genericHandler('title')}
                ref={ref => (this.title = ref)}
                autoFocus
              />
            </li>
            <li>
              <TextField
                label="Description"
                value={this.state.description}
                onChange={this.genericHandler('description')}
              />
            </li>
            <li>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>Due Date</label>
                <Button
                  onClick={this.removeDueDate()}
                  disabled={!this.state.dueDate}
                >
                  Remove Due Date
                </Button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <DayPickerSingleDateController
                  date={this.state.dueDate}
                  onDateChange={this.handleDueDateChange()}
                  focused={this.state.focused}
                  onFocusChange={this.handleDueDateFocus()}
                  numberOfMonths={1}
                />
              </div>
            </li>
            <li>
              <TextField
                label="Location"
                value={this.state.location}
                onChange={this.genericHandler('location')}
              />
            </li>
            <li>
              <TextField
                label="Tags"
                value={this.state.tags}
                onChange={this.genericHandler('tags')}
              />
            </li>
            <li>{getTagsChips(this.state.tags)}</li>
            <li>
              <Images images={this.state.images} />
            </li>
            <li>
              <FileUpload
                disabled={!this.state.loaded}
                noteId={this.state.__id}
                onComplete={this.handleUpload()}
              />
            </li>
            <li style={css.buttons}>
              <Button
                raised
                style={css.button}
                disabled={!this.isValid || !this.isDirty}
              >
                save
              </Button>
              <Link to="/notes" style={css.button} tabIndex="-1">
                <Button ripple={false}>back</Button>
              </Link>
              <Button ripple={false} onClick={this.removeNote()}>
                delete
              </Button>
            </li>
          </ul>
        </FormField>
      </form>
    );
  }
}

export default connect('note', actions)(NoteView);

function getTagsChips(tags) {
  const chips = tags.length
    ? parseTags(tags).map((tag, i) => {
        return (
          <Chip key={i} tabIndex="-1">
            {tag}
          </Chip>
        );
      })
    : null;
  return <ChipSet>{chips}</ChipSet>;
}
