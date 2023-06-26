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
			embed.setDescription('You\'re already onboarded!');
			interaction.reply({ embeds: [embed], ephemeral: true });

			return;
		}

		// Check if the user satisfies minimum roles requirement
		const specRoles = interaction.member.roles.cache.filter(({ id }) => IDS.ROLES.SPECIALISATIONS.includes(id));
		const partRoles = interaction.member.roles.cache.filter(({ id }) => IDS.ROLES.PARTS.includes(id));
		const isNonEcse = interaction.member.roles.cache.has(IDS.ROLES.NON_ECSE);

		if ((specRoles.size === 0 || partRoles.size === 0) && !isNonEcse) {
			const interpolation = (specRoles.size === 0 && partRoles.size === 0)
				? '`Specialisation` and `Part`'
				: (specRoles.size === 0)
					? '`Specialisation`'
					: '`Part`';

			console.info(`INFO: ${interaction.user.username} just attempted to onboard without ${interpolation} role(s).`);

			embed.setTitle('Failed to Onboard')
				.setDescription(`You must select your ${interpolation} before onboarding!\n\nVisit <id:customize> to select your roles.`)
				.setColor(COLOURS.ERROR);
			interaction.reply({ embeds: [embed], ephemeral: true });

			return;
		}

		// Check that the user does not have too many roles
		if (specRoles.size > 1 || partRoles.size > 1) {
			const interpolation = (specRoles.size > 1 && partRoles.size > 1)
				? '`Specialisation` and one `Part`'
				: (specRoles.size === 0)
					? '`Specialisation`'
					: '`Part`';

			console.info(`INFO: ${interaction.user.username} just attempted to onboard with too many ${interpolation.replace('one ', '')} roles.`);

			embed.setTitle('Failed to Onboard')
				.setDescription(`You may only have one ${interpolation} role!\n\nVisit <id:customize> to update your roles.`)
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