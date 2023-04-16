
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('reload')
      .setDescription('Reloads a command.')
      .addStringOption(option =>
          option.setName('command')
              .setDescription('The command to reload.')
              .setRequired(true)),
    // check if command exists
    async execute(interaction) {
        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply(`There is no command with name \`${commandName}\`!`);
        }

        // build correct file path
        delete require.cache[require.resolve(`./${command.data.name}.js`)];

        try {
            await interaction.client.commands.delete(command.data.name);
            const newCommand = require(`./${command.data.name}.js`);
            await interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded.`);
        }
        catch (error) {
            console.error(error);
            await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
        }

    },
};