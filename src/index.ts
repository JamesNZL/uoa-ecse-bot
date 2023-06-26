import { Events, GatewayIntentBits } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';

import { commands } from './commands';

import { Client } from './types/discord';
import { TOKEN, COLOURS } from './.config.json';

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

client.on(
	Events.InteractionCreate,
	async interaction => {
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

			const embed = new EmbedBuilder()
				.setAuthor({
					name: interaction.client.user.username,
					iconURL: interaction.client.user.avatarURL() ?? interaction.client.user.defaultAvatarURL
				})
				.setTitle('Error')
				.setDescription('An error was encountered while executing this command.')
				.setColor(COLOURS.ERROR)
				.setTimestamp();

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ embeds: [embed], ephemeral: true });
			}
			else {
				await interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}
	}
);