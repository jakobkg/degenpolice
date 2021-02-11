import dotenv from "dotenv";
import { ClientOpts, RedisClient } from 'redis';
import Discord from 'discord.js';
import hasDegeneracy, { isFurryOptions } from "is-furry";

dotenv.config();

const redisOptions: ClientOpts = {
  host: 'localhost',
  port: 6379,
  password: process.env.REDISPW
};

const degeneracyOptions: isFurryOptions = {
  fold: false,
  outputMode: 'number',
  strictness: 1,
  checkWordBoundaries: true
};

// INIT THE REDIS STUFF

const redisClient = new RedisClient(redisOptions);

redisClient.once('ready', () => {
  console.log('Redis Client started successfully');
})

// INIT THE DISCORD STUFF

const discordClient = new Discord.Client();

const signImageAttachment = new Discord.MessageAttachment('assets/sign.png');

discordClient.once('ready', () => {
  console.log('Discord Client started successfully');
})

discordClient.on('message', message => {
  const violationsInMsg: number = hasDegeneracy(message.content, degeneracyOptions);
  let pastViolations: number;
  if (violationsInMsg > 0) {
    const criminal: string = message.author.id;
    redisClient.get(criminal, (err, criminalRecord) => {
      if (err) {
        console.log(`Something went wrong while getting {} from DB`, criminal);
        console.log(err);
        return
      }

      if (criminalRecord === null) {
        pastViolations = 0;
      } else {
        pastViolations = parseInt(criminalRecord);
      }

      const totalViolations: number = pastViolations + violationsInMsg;

      message.channel.send(`Total gjeld: \$${totalViolations * 350}`);
      message.channel.send(signImageAttachment);
      redisClient.set(criminal, `${totalViolations}`);
    });
  }
})

discordClient.login(process.env.TOKEN);
