import { formatDistanceToNow, parseISO, format, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';

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

  /**
   * Formats a due time as a human-readable relative string
   * Examples: "Due in 1 hour", "Due in 12 minutes", "Overdue by 2 hours"
   */
  formatRelativeDueTime: (dueTimeString: string, now: Date = new Date()): string => {
    try {
      const dueDate = parseISO(dueTimeString);
      const minutesDiff = differenceInMinutes(dueDate, now);
      const hoursDiff = differenceInHours(dueDate, now);
      const daysDiff = differenceInDays(dueDate, now);

      // Overdue cases
      if (minutesDiff < 0) {
        const absMinutes = Math.abs(minutesDiff);
        const absHours = Math.abs(hoursDiff);
        const absDays = Math.abs(daysDiff);

        if (absMinutes < 60) {
          if (absMinutes < 1) return 'Due now';
          return `Overdue by ${absMinutes} min${absMinutes !== 1 ? 's' : ''}`;
        } else if (absHours < 24) {
          return `Overdue by ${absHours} hour${absHours !== 1 ? 's' : ''}`;
        } else {
          return `Overdue by ${absDays} day${absDays !== 1 ? 's' : ''}`;
        }
      }

      // Due soon / future cases
      if (minutesDiff < 1) {
        return 'Due now';
      } else if (minutesDiff < 60) {
        return `Due in ${minutesDiff} min${minutesDiff !== 1 ? 's' : ''}`;
      } else if (hoursDiff < 24) {
        return `Due in ${hoursDiff} hour${hoursDiff !== 1 ? 's' : ''}`;
      } else {
        return `Due in ${daysDiff} day${daysDiff !== 1 ? 's' : ''}`;
      }
    } catch {
      return 'Due time unavailable';
    }
  },
};
