import pingCommand from './ping';
import setupCommand from './setup';

import { Collection } from '@discordjs/collection';

import { Client } from '../types/discord';

export const commands: Client['commands'] = new Collection([
	[pingCommand.data.name, pingCommand],
	[setupCommand.data.name, setupCommand],
]);