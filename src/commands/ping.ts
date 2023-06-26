import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';

import { GuildCommand } from '../types/discord';
import { COLOURS } from '../.config.json';

const pingCommand: GuildCommand = {
	type: "GUILD",
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check the bot\'s latency.'),
	execute: async interaction => {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: interaction.client.user.username,
				iconURL: interaction.client.user.avatarURL() ?? interaction.client.user.defaultAvatarURL
			})
			.setColor(COLOURS.PRIMARY)
			.setTitle('Pong!')
			.setTimestamp();

		const reply = await interaction.reply({ embeds: [embed], fetchReply: true, ephemeral: true });

		embed.setDescription(`Round-trip latency was \`${reply.createdTimestamp - interaction.createdTimestamp} ms\`.`);

		interaction.editReply({ embeds: [embed] });
	}
};

export default pingCommand;