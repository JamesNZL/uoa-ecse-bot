import { GuildMemberRoleManager } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';

import { Button } from '../types/discord';
import { COLOURS, EMOJI, IDS } from '../.config.json';

const onboardButton: Button = {
	customId: 'onboard',
	execute: async interaction => {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: interaction.client.user.username,
				iconURL: interaction.client.user.avatarURL() ?? interaction.client.user.defaultAvatarURL
			})
			.setColor(COLOURS.PRIMARY)
			.setTimestamp();

		if (!(interaction.member?.roles instanceof GuildMemberRoleManager)) {
			console.error(`ERROR: interaction.member.roles is not a GuildMemberRoleManager!`);

			embed.setTitle('Error')
				.setDescription('Something went wrong, please notify <@192181901065322496>!')
				.setColor(COLOURS.ERROR);
			interaction.reply({ embeds: [embed], ephemeral: true });

			return;
		}

		// Check if the user is already onboarded
		if (!interaction.member.roles.cache.has(IDS.ROLES.ONBOARDING)) {
			console.log(interaction.member.roles.cache.keys());

			embed.setDescription('You\'re already onboarded!');
			interaction.reply({ embeds: [embed], ephemeral: true });

			return;
		}

		// Check if the user satisfies minimum roles requirement
		const hasSpecialisation = interaction.member.roles.cache.some(({ id }) => IDS.ROLES.SPECIALISATIONS.includes(id));
		const hasPart = interaction.member.roles.cache.some(({ id }) => IDS.ROLES.PARTS.includes(id));
		if (!hasSpecialisation || !hasPart) {
			const interpolation = (!hasSpecialisation && !hasPart)
				? '`Specialisation` and `Part`'
				: (!hasSpecialisation)
					? '`Specialisation`'
					: '`Part`';

			console.info(`INFO: ${interaction.user.username} just attempted to onboard without ${interpolation} role(s).`);

			embed.setTitle('Error')
				.setDescription(`You must select your ${interpolation} in <id:customize> before onboarding!`)
				.setColor(COLOURS.ERROR);
			interaction.reply({ embeds: [embed], ephemeral: true });

			return;
		}

		// Remove onboarding role
		await interaction.member.roles.remove(IDS.ROLES.ONBOARDING);

		embed.setTitle('Onboarded!')
			.setDescription('Kia ora, welcome to UoA ECSE!')
			.setColor(COLOURS.SUCCESS)
			.setTimestamp();
		interaction.reply({ embeds: [embed], ephemeral: true });
	}
};

export default onboardButton;