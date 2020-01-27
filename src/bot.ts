import { config } from "dotenv";
config();

import { Client, Message } from "discord.js";
import { prefix } from "./config.json";
const GphApiClient = require("giphy-js-sdk-core");
const { GIPHY_TOKEN } = process.env;

const client: Client = new Client();
const giphy = GphApiClient(GIPHY_TOKEN);

client.once("ready", () => {
  console.log("Bot is ready!");
});

client.on("message", async (message: Message) => {
  console.log(message.content);
  if (message.content.startsWith(`${prefix}ping`)) {
    message.channel.send("🚀 pong");
    // message.reply('pong!');
  }

  if (message.content.startsWith(`${prefix}kick`)) {
    if (message.member.hasPermission(["KICK_MEMBERS"])) {
      const member = message.mentions.members.first();
      if (member) {
        const kickedMember = await member.kick();
        console.log(kickedMember.user.username);
        message.channel.send(`${kickedMember.user.username} has been kicked`);
      }
    } else {
      message.reply("You don't have permission to this");
    }
  }

  if (message.content.startsWith(`${prefix}deletemessages`)) {
    try {
      const messages = await message.channel.fetchMessages();
      await message.channel.bulkDelete(messages);
    } catch (error) {
      console.log(error);
    }
  }

  if (message.content.startsWith(`${prefix}gif`)) {
    try {
      const response = await giphy.search("gifs", { q: "programmer jokes" });
      // console.log(response.data);
      // console.log(response.data.length)
      message.channel.send({
        files: [response.data[0].images.fixed_height.url]
      });
    } catch (error) {
      console.log(error);
    }
  }
});

client.login(process.env.TOKEN);
