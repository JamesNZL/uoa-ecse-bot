import { Client, Events, GatewayIntentBits } from 'discord.js';
import { TOKEN } from './.config.json';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
	]
});

client.once(
	Events.ClientReady,
	(_client) => console.log(`Logged in as ${_client.user?.username}!`)
);

client.login(TOKEN);