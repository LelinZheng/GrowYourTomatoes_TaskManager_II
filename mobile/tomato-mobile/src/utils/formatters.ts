import { formatDistanceToNow, parseISO, format } from 'date-fns';

export const formatters = {
  formatDate: (dateString: string): string => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  },

  formatDateTime: (dateString: string): string => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  },

  formatTime: (dateString: string): string => {
    try {
      return format(parseISO(dateString), 'HH:mm');
    } catch {
      return dateString;
    }
  },

  formatDistanceToNowCustom: (dateString: string): string => {
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  },

  formatTomatoCount: (count: number): string => {
    return `🍅 ${count}`;
  },
};
