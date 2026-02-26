const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, REST, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const commands = [
    new SlashCommandBuilder()
        .setName('vouch')
        .setDescription('Vouch for a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select the user to vouch')
                .setRequired(true)
        )
].map(command => command.toJSON());

client.once('ready', async () => {
    console.log(`✅ Bot is online as ${client.user.tag}`);

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log('✅ Slash command registered');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'vouch') {
        const user = interaction.options.getUser('user');

        const embed = new EmbedBuilder()
            .setTitle('✅ New Vouch')
            .setDescription(`${interaction.user} vouched for ${user}`)
            .setColor(0x00FF00)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
});

client.login(process.env.TOKEN);
