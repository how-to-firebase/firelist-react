import React from 'react';
import { Button } from 'rmwc/Button';
import { FormField } from 'rmwc/FormField';
import { IconToggle } from 'rmwc/IconToggle';
import { TextField } from 'rmwc/TextField';

import { updateNote } from '../database';
import { deleteEmptyValues, slugifyEmail } from '../utilities';
import { Delete } from '../svg';

const css = {
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
  },
  email: {
    flexGrow: '1',
  },
};

export default class Collaborators extends React.Component {
  constructor() {
    super();
    this.state = this.defaultState;
  }

  get defaultState() {
    return {
      newCollaborator: '',
    };
  }

  get isValid() {
    // See http://emailregex.com/
    return (
      this.state.newCollaborator.length &&
      this.state.newCollaborator.match(
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      )
    );
  }

  genericHandler(name) {
    return e => this.setState({ [name]: e.target.value });
  }

  async submit(e) {
    e && e.preventDefault();

    const { newCollaborator } = this.state;
    const email = newCollaborator.toLowerCase();
    const slug = slugifyEmail(email);
    this.setState({ newCollaborator: '' });
    this.addCollaboratorField.mdcRootElement.querySelector('input').focus();

    if (this.isValid) {
      const { noteId, collaborators } = this.props;

      collaborators[slug] = email;

      await this.updateCollaborators(collaborators);
      this.scrollToBottom();
    }
  }

  getCollaborator({ slug, email }, i) {
    return (
      <li key={i} style={css.listItem}>
        <div style={css.email}>{email}</div>

        <IconToggle onClick={this.deleteCollaborator(slug)} ripple={false}>
          <Delete />
        </IconToggle>
      </li>
    );
  }

  deleteCollaborator(slug) {
    return e => {
      const collaborators = { ...this.props.collaborators };

      delete collaborators[slug];

      this.updateCollaborators(collaborators);
    };
  }

  async updateCollaborators(collaborators) {
    const { noteId } = this.props;
    const updates = deleteEmptyValues({
      collaborators,
    });

    return updateNote(noteId, updates);
  }

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  render() {
    const { collaborators } = this.props;
    const flatCollaborators = Object.keys(collaborators).map(slug => ({
      slug,
      email: collaborators[slug],
    }));

    return (
      <div>
        <h2>Collaborators</h2>
        <form onSubmit={this.submit.bind(this)}>
          <FormField>
            <label style={{ display: 'none' }}>edit collaborators</label>
            <ul>
              {flatCollaborators.map(this.getCollaborator.bind(this))}
              <li style={css.listItem}>
                <TextField
                  label="Add an email"
                  value={this.state.newCollaborator}
                  onChange={this.genericHandler('newCollaborator')}
                  ref={ref => (this.addCollaboratorField = ref)}
                  invalid={!this.isValid}
                />
                <Button type="submit">Add</Button>
              </li>
            </ul>
          </FormField>
        </form>
      </div>
    );
  }
}
