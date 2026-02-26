const { 
    Client, 
    GatewayIntentBits, 
    SlashCommandBuilder, 
    REST, 
    Routes, 
    EmbedBuilder 
} = require('discord.js');

const TOKEN = "MTQ3NjYzODYxOTI3MDY0Nzk3MQ.G1fhTq.shbh0zfLrvH1qTOX6tf4NgkAfNA0Fd3zrL4_s8";
const CLIENT_ID = "1476638619270647971";
const GUILD_ID = "1459669957016027360";
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
    console.log(`✅ Bot is online as ${client.user.tag}`);
});

const commands = [
    new SlashCommandBuilder()
        .setName('vouch')
        .setDescription('Vouch a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Choose the user')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('stars')
                .setDescription('How many stars? (1-5)')
                .setMinValue(1)
                .setMaxValue(5)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Your rating message')
                .setRequired(true))
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log("✅ Slash command registered");
    } catch (error) {
        console.error(error);
    }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'vouch') {

        const user = interaction.options.getUser('user');
        const stars = interaction.options.getInteger('stars');
        const description = interaction.options.getString('description');

        const embed = new EmbedBuilder()
            .setTitle("⭐ New Vouch!")
            .setColor(0x00ff00)
            .addFields(
                { name: "User", value: `<@${user.id}>`, inline: true },
                { name: "Stars", value: "⭐".repeat(stars), inline: true },
                { name: "From", value: interaction.user.tag, inline: true },
                { name: "Message", value: description }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
});

client.login(TOKEN);