// ============================================
// 成长档案 - 日期工具
// ============================================

// 获取今天日期字符串
export function getToday() {
  return new Date().toISOString().split('T')[0];
}

// 获取本周日期范围
export function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(now.setDate(diff));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  };
}

// 获取本月日期范围
export function getMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  return {
    start: new Date(year, month, 1).toISOString().split('T')[0],
    end: new Date(year, month + 1, 0).toISOString().split('T')[0]
  };
}

// 获取最近 N 天的日期数组
export function getRecentDays(n) {
  const days = [];
  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

// 获取月份名称
export function getMonthName(month) {
  const names = ['一月', '二月', '三月', '四月', '五月', '六月',
                 '七月', '八月', '九月', '十月', '十一月', '十二月'];
  return names[month];
}

// 计算两个日期之间的天数
export function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2 - d1);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// 判断是否是今天
export function isToday(dateStr) {
  return dateStr === getToday();
}

// 判断是否是本周
export function isThisWeek(dateStr) {
  const range = getWeekRange();
  return dateStr >= range.start && dateStr <= range.end;
}

// 判断是否是本月
export function isThisMonth(dateStr) {
  const range = getMonthRange();
  return dateStr >= range.start && dateStr <= range.end;
}

export default {
  getToday,
  getWeekRange,
  getMonthRange,
  getRecentDays,
  getMonthName,
  daysBetween,
  isToday,
  isThisWeek,
  isThisMonth
};
