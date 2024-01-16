const {
  importExcelFile,
  showElapsedTime,
  writeLog,
} = require('useful-toolbox-js');

const normalizePostalCode = require('./normalizePostalCode');

function getCoordinates(postalCodes) {
  const startTime = new Date();
  let index = 1;

  writeLog.step('Get postal code coordinates');

  // Import Quebec postal codes
  const QcPostalCodes = importExcelFile('./src/QcPostalCodes.xlsx').data;
  writeLog.debug(`QcPostalCodes[0]: ${JSON.stringify(QcPostalCodes[0], null, 2)}`);

  writeLog.info('find coordinates...');

  const data = postalCodes.map((postalCode) => {
    if ((postalCode.latitude || postalCode.Latitude || postalCode.LATITUDE)
    && (postalCode.longitude || postalCode.Longitude || postalCode.LONGITUDE)) {
      writeLog.rewrite(`\r${index} / ${postalCodes.length} processed`);
      index += 1;
      return postalCode;
    }

    const newPostalCode = { ...postalCode, latitude: '', longitude: '' };

    QcPostalCodes.some((QcPostalCode) => {
      const normalizedPC = normalizePostalCode(postalCode[Object.keys(postalCode)[0]]);
      const normalizedQcPC = normalizePostalCode(QcPostalCode.POSTAL_CODE);

      if (normalizedPC === normalizedQcPC) {
        newPostalCode.latitude = QcPostalCode.LATITUDE;
        newPostalCode.longitude = QcPostalCode.LONGITUDE;
        return true;
      }
      return false;
    });

    writeLog.rewrite(`\r${index} / ${postalCodes.length} processed`);
    index += 1;
    return newPostalCode;
  });

  writeLog.log();
  showElapsedTime(startTime);
  writeLog.success('Coordinates obtained');
  return data;
}

module.exports = getCoordinates;
