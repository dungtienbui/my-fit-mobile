import { endOfWeek, format, isWithinInterval, startOfWeek } from "date-fns";

export function formatWeekRangeConditional(date: Date) {
  const today = new Date();

  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const inputWeekStart = startOfWeek(date, { weekStartsOn: 1 });
  const inputWeekEnd = endOfWeek(date, { weekStartsOn: 1 });

  const startStr = format(inputWeekStart, "dd/MM");
  const endStr = format(inputWeekEnd, "dd/MM");

  // Kiểm tra ngày input có nằm trong tuần hiện tại không
  const isCurrentWeek = isWithinInterval(date, {
    start: currentWeekStart,
    end: currentWeekEnd,
  });

  if (isCurrentWeek) {
    return `This week, ${startStr} - ${endStr}`;
  } else {
    return `${startStr} - ${endStr}`;
  }
}

