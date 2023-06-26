import { Client, ActivityType } from 'discord.js';

import { ACTIVITIES } from './.config.json';

function getRandomNumber({ min = 0, max, }: { min?: number, max: number; }) {
	return Math.floor(Math.random() * (max - min) + min);
}

export function setRandomActivity(_client: Client) {
	_client.user?.setPresence({
		activities: [{
			type: ActivityType.Watching,
			name: ACTIVITIES[
				getRandomNumber({ max: ACTIVITIES.length, })
			],
		}],
		status: 'dnd',
	});

	setTimeout(
		() => setRandomActivity(_client),
		getRandomNumber({
			min: 600000, // 10 minutes
			max: 9000000, // 2 hours 30 minutes
		}),
	);
}