import { REST } from "@discordjs/rest";
import { Routes } from 'discord-api-types/v10';

import { commands } from "../commands";

import { TOKEN, IDS } from '../.config.json';

const rest = new REST().setToken(TOKEN);

async function putCommands(route: Parameters<REST['put']>[0], _commands: typeof commands) {
	return await rest.put(
		route,
		{
			body: _commands.map(command => command.data.toJSON()),
		},
	);
}

(async () => {
	try {
		console.log(`Started refreshing ${commands.size} application (/) commands.`);

		// Global commands
		const globalCommands = commands.filter(({ type }) => type === 'GLOBAL');
		await putCommands(
			Routes.applicationCommands(IDS.CLIENT),
			globalCommands
		);

		// Guild commands
		// ! NOTE: This implementation only supports one GUILD_ID.
		const guildCommands = commands.filter(({ type }) => type === 'GUILD');
		await putCommands(
			Routes.applicationGuildCommands(IDS.CLIENT, IDS.GUILD),
			guildCommands
		);

		console.log(`Successfully reloaded ${commands.size} application (/) commands.`);
	}
	catch (error) {
		console.error(error);
	}
})();