import {
	differenceInSeconds,
	differenceInMinutes,
	differenceInHours,
	differenceInDays
} from 'date-fns';

export function shortTimeAgo(date: string | number | Date | undefined): string {
	const now = new Date();
	const past = new Date(String(date));

	const seconds = differenceInSeconds(now, past);
	if (seconds < 60) return `${seconds}s`;

	const minutes = differenceInMinutes(now, past);
	if (minutes < 60) return `${minutes}m`;

	const hours = differenceInHours(now, past);
	if (hours < 24) return `${hours}h`;

	const days = differenceInDays(now, past);
	return `${days}d`;
}
