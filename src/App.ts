import config from '../config.json';
import { getAuthorNick, shouldRespond } from './helpers';
import { ClientOpts, RedisClient } from 'redis';
import Discord from 'discord.js';
import hasDegeneracy, { isFurryOptions } from 'is-furry';

const redisOptions: ClientOpts = {
  host: config.databaseAddress,
  port: config.databasePort,
  retry_strategy: (options) => {

    options.total_retry_time = 10000;
    return 500;
  },
};

const degeneracyOptions: isFurryOptions = {
  fold: false,
  outputMode: 'number',
  strictness: 1,
  checkWordBoundaries: true,
};

// INIT THE REDIS STUFF

const redisClient = new RedisClient(redisOptions);

redisClient.once('ready', () => {
  console.log('Redis Client started successfully');
});

// INIT THE DISCORD STUFF

const discordClient = new Discord.Client();

const signImageAttachment = new Discord.MessageAttachment('assets/sign.png');

discordClient.once('ready', () => {
  console.log('Discord Client started successfully');
});

// MAIN LOGIC

discordClient.on('message', message => {
  const violationsInMsg: number = hasDegeneracy(message.content, degeneracyOptions);
  let pastViolations: number;

  if (!shouldRespond(message, config)) {
    return;
  }

  if (violationsInMsg > 0) {
    const criminal: string = message.author.id;
    redisClient.get(criminal, (err, criminalRecord) => {
      if (err) {
        console.log(`Something went wrong while getting ${criminal} from DB`);
        console.log(err);
        return;
      }

      if (criminalRecord === null) {
        pastViolations = 0;
      } else {
        pastViolations = parseInt(criminalRecord);
      }

      const totalViolations: number = pastViolations + violationsInMsg;

      getAuthorNick(message).then((authorNick) => {
        if (authorNick == null) {
          authorNick = message.author.username;
        }
        message.channel.send(`${authorNick} sin totale gjeld: $${totalViolations * 350}`);
        message.channel.send(signImageAttachment);
        redisClient.set(criminal, `${totalViolations}`);
      });
    });
  }
});

// LOG IN TO DISCORD

discordClient.login(config.token)
  .then(() => {
    console.log('\nSuccessfully logged in as:', discordClient.user?.tag);
    console.log('To invite your bot to your server, open the following in a browser:');
    console.log(`https://discord.com/api/oauth2/authorize?client_id=${discordClient.user?.id}&permissions=116736&scope=bot\n`);
  })
  .catch(() => {
    console.log('Unable to log in to Discord!');
    console.log('To user this bot you need a valid bot token from Discord, see:');
    console.log('https://discord.com/developers/docs/topics/oauth2#bots\n');
    console.log('See readme for further instructions');
    process.exit(1);
  });
