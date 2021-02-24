import Config from '../../config.json';
import { Message } from 'discord.js';

export function shouldRespond(message: Message, config: typeof Config): boolean {
  if (config.defaultBehavior === 'allow') {
    if (config.denyList.includes(message.channel.id)) {
      return false;
    }

    return true;
  } else {
    if (config.allowList.includes(message.channel.id)) {
      return true;
    }

    return false;
  }
}
