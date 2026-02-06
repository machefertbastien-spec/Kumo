// Manual mock for date-fns
const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const format = (date, formatStr, options) => {
  if (typeof date === 'number') date = new Date(date);
  return date.toISOString();
};

const startOfWeek = (date, options) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfWeek = (date, options) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (day === 0 ? 0 : 7 - day);
  d.setDate(diff);
  d.setHours(23, 59, 59, 999);
  return d;
};

const addDays = (date, amount) => {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
};

const subDays = (date, amount) => {
  const d = new Date(date);
  d.setDate(d.getDate() - amount);
  return d;
};

const differenceInDays = (dateLeft, dateRight) => {
  const left = new Date(dateLeft);
  const right = new Date(dateRight);
  const diffTime = left.getTime() - right.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const differenceInWeeks = (dateLeft, dateRight) => {
  const left = new Date(dateLeft);
  const right = new Date(dateRight);
  const diffTime = left.getTime() - right.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
};

const differenceInMonths = (dateLeft, dateRight) => {
  const left = new Date(dateLeft);
  const right = new Date(dateRight);
  return (left.getFullYear() - right.getFullYear()) * 12 + (left.getMonth() - right.getMonth());
};

const parseISO = (dateString) => new Date(dateString);

const isValid = (date) => date instanceof Date && !isNaN(date.getTime());

module.exports = {
  startOfDay,
  endOfDay,
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  parseISO,
  isValid,
};
