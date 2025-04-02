export const getFirstAndLastDateOfMonth = (month: number) => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + month, 0);
  return [changeDateFormat(firstDay), changeDateFormat(lastDay)];
};

export const changeDateFormat = (value: Date) => {
  const [date, month, year] = value.toLocaleDateString().split('/');
  return `${year}-${getZeroPrefix(month)}-${getZeroPrefix(date)}`;
};

export const getZeroPrefix = (val) => {
  const digit = Number(val);
  return digit > 9 ? `${digit}` : `0${digit}`;
};

export const createQueryKey = (obj: Record<string, any>) => {
  let result = '';
  Object.entries(obj).map(([key, value]) => {
    if (value) {
      result += `${key}:${value}-`;
    }
  });
  return result;
};
