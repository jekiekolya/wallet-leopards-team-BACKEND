const formatNumber = num => {
  const number = (Math.round(num * 100) / 100).toFixed(2);
  return Number(number);
};

module.exports = formatNumber;
