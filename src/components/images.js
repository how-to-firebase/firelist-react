import React from 'react';
import { connect } from 'unistore/react';
import { actions } from '../store';
import { Button } from 'rmwc/Button';
import { IconToggle } from 'rmwc/IconToggle';

import { deleteImage } from '../storage';
import { formatDoc } from '../utilities';
import { Delete } from '../svg';

export function Images({ images }) {
  const imagesList = Object.keys(images).map(md5Hash => ({
    md5Hash,
    ...images[md5Hash],
  }));

  return (
    <div>
      {imagesList.map((image, i) => {
        return <Image key={i} {...image} />;
      })}
    </div>
  );
}

export default connect('environment', actions)(Images);

const css = {
  wrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '275px',
    width: '250px',
  },
  deleteButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
  },
  img: {
    maxHeight: 'calc(100% - 25px)',
    maxWidth: 'calc(100% - 1rem)',
  },
  filename: {
    fontSize: '10px',
  },
};

class Image extends React.Component {
  constructor() {
    super();
    this.state = { disabled: false };
  }
  removeImage() {
    return () => {
      this.setState({ disabled: true });
      deleteImage(this.props.name);
    };
  }

  render() {
    const { downloadURL, filename, name } = this.props;
    return (
      <div style={css.wrapper} disabled={this.state.disabled}>
        <IconToggle onClick={this.removeImage()} style={css.deleteButton}>
          <Delete highlight="true" />
        </IconToggle>
        <img src={downloadURL} alt={filename} style={css.img} />
        <span style={css.filename}>{filename}</span>
      </div>
    );
  }
}
