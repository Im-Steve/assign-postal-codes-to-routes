const { writeLog } = require('useful-toolbox-js');

function removeDuplicates(postalCodes) {
  writeLog.step('Remove duplicates');
  writeLog.info('work in progress...');

  const seen = new Set();
  const dataCleaned = postalCodes.filter((postalCode) => {
    const code = postalCode[Object.keys(postalCode)[0]];

    if (!seen.has(code)) {
      seen.add(code);
      return true;
    }
    return false;
  });

  const nbRemoved = postalCodes.length - dataCleaned.length;
  writeLog.log('Number of postal codes removed:', nbRemoved);

  return dataCleaned;
}

module.exports = removeDuplicates;
