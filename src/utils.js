module.exports.checkItemsInRange = (range, items) =>
  items.every((item) =>
    range.includes(item));
