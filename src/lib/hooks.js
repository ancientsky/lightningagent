import { useEffect, useState } from 'react';

// Ticking clock for "LIVE" mockups.
export function useClock(intervalMs = 1000) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  const pad = (n) => String(n).padStart(2, '0');
  return {
    now,
    timeStr: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
    hmStr: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    dateStr: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    weekday: ['日', '一', '二', '三', '四', '五', '六'][now.getDay()],
  };
}
