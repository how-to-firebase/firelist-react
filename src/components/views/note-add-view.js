import React from 'react';
import { connect } from 'unistore/react';
import { actions } from '../../store';
import { Link } from 'react-router-dom';
import { FormField } from 'rmwc/FormField';
import { TextField } from 'rmwc/TextField';
import { Button, ButtonIcon } from 'rmwc/Button';
import { addNote } from '../../database';

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

export class NoteAddView extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }

  get defaultState() {
    return {
      title: '',
      description: '',
    };
  }

  get isValid() {
    return this.state.title.length;
  }

  handleTitle(e) {
    this.setState({ title: e.target.value });
  }

  handleDescription(e) {
    this.setState({ description: e.target.value });
  }

  submit(e) {
    const { title, description } = this.state;
    const { currentUser } = this.props;

    e.preventDefault();
    this.setState(this.defaultState);
    this.title.mdcRootElement.querySelector('input').focus();
    addNote({ title, description, currentUser });
  }

  render() {
    return (
      <div>
        <h1>ADD A NOTE</h1>

        <form onSubmit={this.submit.bind(this)}>
          <FormField>
            <label style={css.hidden}>add a note</label>
            <ul>
              <li>
                <TextField
                  label="Title"
                  value={this.state.title}
                  onChange={this.handleTitle.bind(this)}
                  ref={ref => (this.title = ref)}
                  autoFocus
                />
              </li>
              <li>
                <TextField
                  label="Description"
                  value={this.state.description}
                  onChange={this.handleDescription.bind(this)}
                />
              </li>
              <li style={css.buttons}>
                <Button raised style={css.button} disabled={!this.isValid}>
                  add
                </Button>
                <Link to="/notes" style={css.button} tabIndex="-1">
                  <Button ripple={false}>back</Button>
                </Link>
              </li>
            </ul>
          </FormField>
        </form>
      </div>
    );
  }
}

export default connect('currentUser', actions)(NoteAddView);
