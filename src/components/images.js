import React from 'react';
import { connect } from 'unistore/react';
import { actions } from '../store';
import { Button } from 'rmwc/Button';
import { IconToggle } from 'rmwc/IconToggle';

import { deleteImage } from '../storage';
import { formatDoc } from '../utilities';
import { Delete } from '../svg';

const css = {
  wrapper: {
    display: 'flex',
  },
};

export function Images({ images }) {
  const imagesList = Object.keys(images).map(md5Hash => ({
    md5Hash,
    ...images[md5Hash],
  }));

  return (
    <div style={css.wrapper}>
      {imagesList.map((image, i) => {
        return <Image key={i} {...image} />;
      })}
    </div>
  );
}

export default connect('environment', actions)(Images);

const imageCss = {
  wrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '275px',
    maxWidth: '250px',
    padding: '0 .5rem'
  },
  deleteButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
  },
  img: {
    height: 'calc(100% - 25px)',
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
      <div style={imageCss.wrapper} disabled={this.state.disabled}>
        {name && (
          <IconToggle
            onClick={this.removeImage()}
            style={imageCss.deleteButton}
          >
            <Delete highlight="true" />
          </IconToggle>
        )}
        <img src={downloadURL} alt={filename} style={imageCss.img} />
        <span style={imageCss.filename}>{filename}</span>
      </div>
    );
  }
}
