function normalizePostalCode(text) {
  if (typeof text !== 'string') {
    return text;
  }

  return text
    .toLowerCase()
    .replace(/\s/g, '');
}

module.exports = normalizePostalCode;
