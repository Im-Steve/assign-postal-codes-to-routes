const { writeLog } = require('useful-toolbox-js');

function showUsage() {
  writeLog.log(
    'Usage: node assign.js <EXCEL WITH POSTAL CODES> <GOOGLE MY MAPS .csv>',
  );
}

module.exports = showUsage;
