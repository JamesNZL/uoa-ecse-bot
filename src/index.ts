import { Events, GatewayIntentBits } from 'discord.js';
import { commands } from './commands';

import { Client } from './types/discord';
import { TOKEN } from './.config.json';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
	]
});

client.commands = commands;

client.login(TOKEN);

client.once(
	Events.ClientReady,
	_client => console.log(`Logged in as ${_client.user?.username}!`)
);

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`ERROR: Failed to find command ${interaction.commandName}.`);
		return;
	}

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});