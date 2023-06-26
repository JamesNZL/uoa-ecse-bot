import { SlashCommandBuilder } from '@discordjs/builders';

import { GuildCommand } from '../types/discord';

const pingCommand: GuildCommand = {
	type: "GUILD",
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check the bot\'s latency.'),
	execute: async interaction => {
		const reply = await interaction.reply({ content: 'Pong!', fetchReply: true, ephemeral: true });

		interaction.editReply(`Pong! | Round-trip latency was \`${reply.createdTimestamp - interaction.createdTimestamp} ms\``);
	}
};

export default pingCommand;