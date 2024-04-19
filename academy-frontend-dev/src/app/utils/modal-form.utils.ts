export interface IQuestion {
  title: string;
  description: string;
  topics: string[];
  type: string;
  time: number;
}

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;

  return `${formattedHours}:${formattedMinutes}`;
}

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':');
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
}
