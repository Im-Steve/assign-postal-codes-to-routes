function formatCSV(data) {
  return data.map((row) => {
    const manipulatedRow = {};
    const finalRow = { areaName: '', coordinates: [] };
    let stopRowFormatting = false;

    Object.keys(row).forEach((key) => {
      if (typeof row[key] === 'string') {
        manipulatedRow[key] = row[key]
          .replace('POLYGON ((', '')
          .replace('))', '')
          .replace('GEOMETRYCOLLECTION (', '')
          .replace('LINESTRING (', '')
          .replace('(', '')
          .replace(')', '');
        manipulatedRow[key] = manipulatedRow[key].split(' ');

        if (manipulatedRow[key][0] === '') {
          manipulatedRow[key].shift();
        }

        manipulatedRow[key] = manipulatedRow[key].map((coordinate) => {
          const parsedCoordinate = parseFloat(coordinate);
          return !Number.isNaN(parsedCoordinate) ? parsedCoordinate : coordinate;
        });

        if (typeof manipulatedRow[key][0] === 'string' && !stopRowFormatting) {
          manipulatedRow[key] = row[key].replace('Â', '');
          stopRowFormatting = true;
          Object.keys(manipulatedRow).forEach((manipulatedRowKey) => {
            finalRow.coordinates.push(manipulatedRow[manipulatedRowKey]);
          });
        }
      }
    });

    finalRow.areaName = finalRow.coordinates.pop();
    finalRow.coordinates = finalRow.coordinates.map((subArray) => subArray.reverse());
    return finalRow;
  });
}

module.exports = formatCSV;
