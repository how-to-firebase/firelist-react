import React from 'react';
import { Button } from 'rmwc/Button';
import { FormField } from 'rmwc/FormField';
import { IconToggle } from 'rmwc/IconToggle';
import { TextField } from 'rmwc/TextField';
import { Checkbox } from 'rmwc/Checkbox';

import { updateNote } from '../database';
import { deleteEmptyValues } from '../utilities';
import { Delete } from '../svg';

const css = {
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
  },
};

export default class Todos extends React.Component {
  constructor() {
    super();
    this.state = this.defaultState;
  }

  get defaultState() {
    return {
      newTask: '',
    };
  }

  get isValid() {
    return this.state.newTask.length;
  }

  get completedPercentage() {
    const { tasks } = this.props;
    const completedTasks = tasks.filter(task => !!task.completed);
    return Math.round(100 * completedTasks.length / tasks.length);
  }

  genericHandler(name) {
    return e => this.setState({ [name]: e.target.value });
  }

  async submit(e) {
    e && e.preventDefault();

    const { newTask } = this.state;
    this.setState({ newTask: '' });
    this.addTaskField.mdcRootElement.querySelector('input').focus();

    if (this.isValid) {
      const { noteId, tasks } = this.props;

      tasks.push({
        text: newTask,
        date: new Date().toString(),
      });

      await this.updateTasks(tasks);
      this.scrollToBottom();
    }
  }

  getTask(task, i) {
    return (
      <li key={i} style={css.listItem}>
        <Checkbox
          checked={task.completed || false}
          onChange={this.updateTask(i)}
        >
          {task.text}
        </Checkbox>
        <IconToggle onClick={this.deleteTask(i)} ripple={false}>
          <Delete />
        </IconToggle>
      </li>
    );
  }

  deleteTask(i) {
    return e => {
      const tasks = this.props.tasks.slice(0);

      tasks.splice(i, 1);

      this.updateTasks(tasks);
    };
  }

  updateTask(i) {
    return e => {
      const tasks = this.props.tasks.slice(0);

      tasks[i].completed = e.target.checked;

      this.updateTasks(tasks);
    };
  }

  async updateTasks(tasks) {
    const { noteId } = this.props;
    const updates = deleteEmptyValues({
      tasks,
    });

    return updateNote(noteId, updates);
  }

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  render() {
    const { tasks } = this.props;
    const completedPercentage = this.completedPercentage;

    return (
      <div>
        <h2>Tasks</h2>
        <form onSubmit={this.submit.bind(this)}>
          <FormField>
            <ul>
              {!!tasks.length && (
                <li className="progress-bar background">
                  <div style={{ width: `${this.completedPercentage}%` }} />
                </li>
              )}
              {tasks.map(this.getTask.bind(this))}
              <li style={css.listItem}>
                <TextField
                  label="Add a task"
                  value={this.state.newTask}
                  onChange={this.genericHandler('newTask')}
                  ref={ref => (this.addTaskField = ref)}
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
