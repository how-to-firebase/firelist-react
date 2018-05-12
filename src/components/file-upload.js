import React from 'react';
import { connect } from 'unistore/react';
import { actions } from '../store';
import { Button } from 'rmwc/Button';

import { getUploadObservable } from '../storage';

const css = {
  fileInput: {
    display: 'none',
  },
  fileItem: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

export class FileUpload extends React.Component {
  constructor() {
    super();
    this.state = { files: [] };
  }

  clickFileInput() {
    return () => this.fileInput.click();
  }

  handleChange() {
    return async ({ target }) => {
      const promises = [...target.files].map(async file => {
        const src = await getFileSrc(file);

        return {
          file,
          src,
          progress: 0,
        };
      });
      const files = await Promise.all(promises);
      this.setState({ files });
    };
  }

  startUpload() {
    const { environment } = this.props;

    return () => {
      const { files } = this.state;
      const { noteId, onComplete } = this.props;
      files.map(({ file, src }) =>
        getUploadObservable(
          file,
          `${environment.uploadPath}/${noteId}`
        ).subscribe(
          progress => this.updateFileProgress(file, progress),
          error => console.log('file, error', file, error),
          () => {
            onComplete({ file, src });
            this.removeFile(file);
          }
        )
      );
    };
  }

  updateFileProgress({ name }, progress) {
    const index = this.state.files.findIndex(({ file }) => file.name == name);
    const files = this.state.files.slice(0);
    files[index].progress = progress;

    this.setState({ files });
  }

  removeFile({ name }) {
    const files = this.state.files
      .filter(({ file }) => file.name != name)
      .slice(0);

    this.setState({ files });
  }

  render() {
    return (
      <div>
        <ul>
          <li>
            <label htmlFor="file-upload" style={css.buttonWrapper}>
              <Button
                onClick={this.clickFileInput()}
                disabled={this.props.disabled}
              >
                Select Images to Upload
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              ref={ref => (this.fileInput = ref)}
              style={css.fileInput}
              onChange={this.handleChange()}
              multiple
            />
          </li>
          <li style={css.fileItem}>
            {this.state.files.map((file, i) => <File key={i} {...file} />)}
          </li>
          {this.state.files.length ? (
            <li style={css.buttonWrapper}>
              <Button onClick={this.startUpload()}>Upload</Button>
            </li>
          ) : null}
        </ul>
      </div>
    );
  }
}

export default connect('environment', actions)(FileUpload);

const fileCss = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '275px',
    width: '250px',
    margin: '1rem 0',
  },
  img: {
    maxHeight: 'calc(100% - 25px)',
    maxWidth: 'calc(100% - 1rem)',
  },
  progressBar: {
    width: 'calc(100% - 1rem)',
  },
  filename: {
    fontSize: '10px',
  },
};
function File({ file, src, progress }) {
  return (
    <div style={fileCss.wrapper}>
      <img src={src} alt={file.name} style={fileCss.img} />
      <div className="progress-bar" style={fileCss.progressBar}>
        <div style={{ width: `${progress * 100}%` }} />
      </div>
      <span style={fileCss.filename}>{file.name}</span>
    </div>
  );
}

async function getFileSrc(file) {
  const reader = new FileReader();
  const promise = new Promise(resolve => {
    reader.addEventListener('load', () => resolve(reader.result), false);
  });

  reader.readAsDataURL(file);

  return promise;
}
