import { PermissionFlagsBits, ButtonStyle } from 'discord.js';
import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } from '@discordjs/builders';

import onboardButton from '../buttons/onboard';

import { GuildCommand } from '../types/discord';
import { COLOURS, EMOJI, IDS } from '../.config.json';

const setupCommand: GuildCommand = {
	type: "GUILD",
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Setup server onboarding message.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	execute: async interaction => {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: interaction.client.user.username,
				iconURL: interaction.client.user.avatarURL() ?? interaction.client.user.defaultAvatarURL
			})
			.setColor(COLOURS.PRIMARY)
			.setTimestamp();

		const onboardingChannel = interaction.client.channels.cache.get(IDS.CHANNELS.ONBOARDING) ?? await interaction.client.channels.fetch(IDS.CHANNELS.ONBOARDING);
		if (!onboardingChannel) {
			console.error(`ERROR: Unable to fetch onboarding channel with ID ${IDS.CHANNELS.ONBOARDING}.`);

			embed.setTitle('Error')
				.setDescription(`Failed to fetch onboarding channel \`${IDS.CHANNELS.ONBOARDING}\`.`)
				.setColor(COLOURS.ERROR);
			interaction.reply({ embeds: [embed] });

			return;
		}

		if (!onboardingChannel.isTextBased() || onboardingChannel.isDMBased()) {
			console.error(`ERROR: Channel with ID ${IDS.CHANNELS.ONBOARDING} is not a guild text channel.`);

			embed.setTitle('Error')
				.setDescription(`${onboardingChannel} is not a guild text channel.`)
				.setColor(COLOURS.ERROR);
			interaction.reply({ embeds: [embed] });

			return;
		}

		const onboardingEmbed = new EmbedBuilder()
			.setAuthor({
				name: interaction.client.user.username,
				iconURL: interaction.client.user.avatarURL() ?? interaction.client.user.defaultAvatarURL
			})
			.setTitle('Onboard me!')
			.setDescription(`Click the <:${EMOJI.NAME}:${EMOJI.ID}> button below to enter the server.`)
			.setColor(COLOURS.PRIMARY);

		const button = new ButtonBuilder()
			.setCustomId(onboardButton.customId)
			.setEmoji({ id: EMOJI.ID })
			.setStyle(ButtonStyle.Primary);

		const buttonRow = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(button);

		const alreadySentPreviously = (await onboardingChannel.messages.fetch())
			.some(message => {
				return (
					message.author.id === interaction.client.user.id &&
					message.embeds?.[0]?.title === onboardingEmbed.data.title
				);
			});
		if (alreadySentPreviously) {
			embed.setTitle('Error')
				.setDescription(`I have already sent an onboarding message to ${onboardingChannel}.`)
				.setColor(COLOURS.ERROR);
			interaction.reply({ embeds: [embed] });

			return;
		}

		embed.setDescription(`Creating onboarding message in ${onboardingChannel}...`)
			.setTimestamp();
		await interaction.reply({ embeds: [embed] });

		await onboardingChannel.send({
			embeds: [onboardingEmbed],
			components: [buttonRow],
		});

		embed.setDescription(`Created onboarding message in ${onboardingChannel}!`)
			.setColor(COLOURS.SUCCESS)
			.setTimestamp();
		interaction.followUp({ embeds: [embed] });
	}
};

export default setupCommand;