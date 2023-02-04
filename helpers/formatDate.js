function formatDate(date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours() + 2,
      date.getMinutes(),
      date.getSeconds()
    )
  );
}

module.exports = formatDate;
