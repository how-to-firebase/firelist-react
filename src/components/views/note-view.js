import React from 'react';
import { actions } from '../../store';
import { connect } from 'unistore/react';
import { Link } from 'react-router-dom';
import { Button } from 'rmwc/Button';
import { FormField } from 'rmwc/FormField';
import { TextField } from 'rmwc/TextField';

import { getNoteObservable } from '../../database';

import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

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
    };
  }

  get isValid() {
    return this.state.title.length;
  }

  componentDidMount() {
    const { noteId, setNote } = this.props;
    this.subscription = getNoteObservable(noteId).subscribe(note => {
      this.setState(note);
    });
  }

  componentWillUnmount() {
    this.subscription.unlisten();
    setNote();
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
    return momentDate => this.setState({ dueDate: momentDate.toString() });
  }

  handleDueDateFocus() {
    return ({ focused }) => this.setState({ focused });
  }

  submit(e) {
    const { title, description, dueDate } = this.state;
    const { noteId } = this.props;
    e.preventDefault();

    const updates = {
      title,
      description,
      dueDate,
    };
  }

  render() {
    console.log('this.state.dueDate', this.state.dueDate);
    return (
      <form onSubmit={this.submit.bind(this)}>
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
              <SingleDatePicker
                date={this.state.dueDate}
                onDateChange={this.handleDueDateChange()}
                focused={this.state.focused}
                onFocusChange={this.handleDueDateFocus()}
                numberOfMonths={1}
              />
            </li>
            <li style={css.buttons}>
              <Button raised style={css.button} disabled={!this.isValid}>
                save
              </Button>
              <Link to="/notes" style={css.button} tabIndex="-1">
                <Button ripple={false}>back</Button>
              </Link>
            </li>
          </ul>
        </FormField>
      </form>
    );
  }
}

export default connect('note', actions)(NoteView);
