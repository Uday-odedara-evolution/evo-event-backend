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

export const getZeroPrefix = (val: string) => {
  const digit = Number(val);
  return digit > 9 ? digit.toString() : `0${digit.toString()}`;
};

export const createQueryKey = (obj: Record<string, string>) => {
  let result = '';
  Object.entries(obj).forEach(([key, value]) => {
    if (value) {
      result += `${key}:${value}-`;
    }
  });
  return result;
};
