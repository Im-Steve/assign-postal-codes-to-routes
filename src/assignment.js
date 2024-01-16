const {
  startRecordingLogs,
  stopRecordingLogs,
  showFormattedTime,
  showElapsedTime,
  importExcelFile,
  exportExcelFile,
  happyStickFigure,
  writeLog,
} = require('useful-toolbox-js');

const assignRoutes = require('./assignRoutes');
const formatCSV = require('./formatCSV');
const getCoordinates = require('./getCoordinates');
const removeDuplicates = require('./removeDuplicates');
const showUsage = require('./showUsage');

async function assignment() {
  if (process.argv.length >= 3 && process.argv[2] === 'usage') {
    showUsage();
    process.exit();
  }

  if (process.argv.length < 4
  || !process.argv[2].includes('.xlsx')
  || !process.argv[3].includes('.csv')) {
    writeLog.error('Error: Invalid use of arguments');
    showUsage();
    process.exit();
  }

  const postalCodeFile = process.argv.length >= 3 && process.argv[2];
  const routeFile = process.argv.length >= 4 && process.argv[3];

  // Start
  await startRecordingLogs();
  writeLog.step('Start assignment');
  writeLog.dev(`postalCodeFile: ${postalCodeFile}`);
  writeLog.dev(`routeFile: ${routeFile}`);

  // Set time
  const startTime = new Date();
  showFormattedTime(startTime);
  writeLog.log('--------------------');

  // Import postal codes
  const postalCodes = importExcelFile(postalCodeFile).data;
  writeLog.debug(`postalCodes[0]: ${JSON.stringify(postalCodes[0], null, 2)}`);
  writeLog.log('--------------------');

  // Import routes
  const importedRoutes = importExcelFile(routeFile).data;
  writeLog.debug(`importedRoutes[0]: ${JSON.stringify(importedRoutes[0], null, 2)}`);
  const routes = formatCSV(importedRoutes);
  writeLog.debug(`routes[0]: ${JSON.stringify(routes[0], null, 2)}`);
  writeLog.log('--------------------');

  // Get postal code coordinates
  const PCWithCoordinates = getCoordinates(postalCodes);
  writeLog.debug(`PCWithCoordinates[0]: ${JSON.stringify(PCWithCoordinates[0], null, 2)}`);
  writeLog.log('--------------------');

  // Assign to routes
  const PCWithRoute = assignRoutes(PCWithCoordinates, routes);
  writeLog.debug(`PCWithRoute[0]: ${JSON.stringify(PCWithRoute[0], null, 2)}`);
  writeLog.log('--------------------');

  // Remove duplicates
  const PCCleaned = removeDuplicates(PCWithRoute);
  writeLog.debug(`PCCleaned[0]: ${JSON.stringify(PCCleaned[0], null, 2)}`);
  writeLog.log('--------------------');

  // Export the final file
  const exportedFile = exportExcelFile(
    PCCleaned,
    'assignedPostalCodes',
  );
  writeLog.debug(`exportedFile.data[0]: ${JSON.stringify(exportedFile.data[0], null, 2)}`);
  writeLog.log('--------------------');

  // End
  showElapsedTime(startTime);
  writeLog.success('Assignment finished!');
  await happyStickFigure();
  stopRecordingLogs();
}

module.exports = assignment;
