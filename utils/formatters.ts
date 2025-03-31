import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


export const formatTitle = (title: string | undefined) => {
  return title?.replace(/\s+/g, '-')
}

export const formatDateTime = (value: string | number | Date | undefined) => {
  return dayjs(value).fromNow();
}