type InputDate = number | string | Date

interface Timestamps {
  fullTimestamp: string
  dayTimestamp: string
  hourTimestamp: string
  longDayTimestamp: string
}

export function getTimestampFromSeconds(date: InputDate): Timestamps {
  let timestamp: number

  if (date instanceof Date) {
    timestamp = date.getTime()
  } else {
    const raw = typeof date === 'string' ? Number(date) : date

    // detecta si ya es milisegundos (más de 10 dígitos)
    timestamp = raw > 1e12 ? raw : raw * 1000;

  }

  const d = new Date(timestamp)

  const pad = (n: number) => String(n).padStart(2, '0')

  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())

  const today = new Date()
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()

  //el formato no es el correcto, pendiente
  // const longDayTimestamp = isToday
  //   ? 'Today'
  //   : `${new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(d)} ${d.getDate()}`

  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(d);
  const longDayTimestamp = isToday
    ? 'Today'
    : `${weekday} ${day}`;

  return {
    fullTimestamp: `${year}-${month}-${day} ${hours}:${minutes}`,
    dayTimestamp: `${year}-${month}-${day}`,
    hourTimestamp: `${hours}:${minutes}`,
    longDayTimestamp,
  }
}


export function groupMessagesByDate(messages: any[]) {
  const grouped: Record<string, any[]> = {};

  messages.forEach((msg) => {
    const timestamp = getTimestampFromSeconds(msg.createdAt);
    const dateLabel = timestamp.longDayTimestamp;

    if (!grouped[dateLabel]) {
      grouped[dateLabel] = [];
    }

    grouped[dateLabel].push(msg);
  });

  return grouped;
}



export const downloadJSON = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
