const { resolve, join } = require("path");

const getBackend = () => resolve("./backend");

function makeDBName(name) {
  const DIR = join(getBackend(), "data/db");
  return join(DIR, name + ".db");
}

module.exports = {
  getBackend,
  makeDBName,
};
