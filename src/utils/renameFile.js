import uuid from 'uuid/v1';

export default (filename) => {
  const uniqueName = uuid().split("-")[0];
  const mimeType = filename.slice(filename.lastIndexOf('.') + 1);
  return `gif_${uniqueName}.${mimeType}`;
}