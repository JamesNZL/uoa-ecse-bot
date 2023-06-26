import onboardButton from './onboard';

import { Collection } from '@discordjs/collection';

import { Client } from '../types/discord';

export const buttons: Client['buttons'] = new Collection([
	[onboardButton.customId, onboardButton],
]);