export default (paths: string[]) => {
  return paths.map(filepath => {
    // tslint:disable-next-line:non-literal-require
    const loaded = require(filepath).default;
    loaded.filepath = filepath;
    return loaded;
  });
}
