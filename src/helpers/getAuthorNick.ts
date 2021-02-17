import Discord from 'discord.js'

export async function getAuthorNick(message: Discord.Message) {
  const member = await message.guild?.member(message.author);
  return member ? member.nickname : message.author.username;
}
