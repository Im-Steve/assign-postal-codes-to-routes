const Polygon = require('polygon');
const Vec2 = require('vec2');
const { showElapsedTime, writeLog } = require('useful-toolbox-js');

function assignRoutes(postalCodes, routes, scale = 1) {
  const startTime = new Date();
  let index = 1;

  writeLog.step('Assign to routes');
  writeLog.info('find routes...');

  const data = postalCodes.map((postalCode) => {
    const newPostalCode = { ...postalCode, mapArea: '' };

    routes.some((route) => {
      let isInside = false;

      const area = new Polygon(route.coordinates);

      if (scale && !Number.isNaN(scale)) {
        area.scale(parseFloat(scale));
      }

      const latitude = postalCode.latitude || postalCode.Latitude || postalCode.LATITUDE;
      const longitude = postalCode.longitude || postalCode.Longitude || postalCode.LONGITUDE;

      if (latitude && longitude) {
        isInside = area.containsPoint(Vec2(latitude, longitude));
      }

      if (isInside) {
        newPostalCode.mapArea = route.areaName;
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
  writeLog.success('Routes obtained');
  return data;
}

module.exports = assignRoutes;
