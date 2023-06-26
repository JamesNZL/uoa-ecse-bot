import { Client as BaseClient, CommandInteraction } from 'discord.js';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { Collection } from '@discordjs/collection';

export class Client extends BaseClient {
	public commands: Commands = new Collection();
}

export interface GlobalCommand {
	type: "GLOBAL";
	data: SlashCommandBuilder | SlashCommandSubcommandBuilder;
	execute: (interaction: CommandInteraction) => Promise<void>;
}
export interface GuildCommand {
	type: "GUILD";
	data: SlashCommandBuilder | SlashCommandSubcommandBuilder;
	execute: (interaction: CommandInteraction) => Promise<void>;
}

type Command = GlobalCommand | GuildCommand;

export type Commands = Collection<string, Command>;