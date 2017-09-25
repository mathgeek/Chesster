//------------------------------------------------------------------------------
// Commands related to game nomination
//------------------------------------------------------------------------------
const moment = require('moment-timezone');
const winston = require("winston");
const heltour = require('../heltour.js');
const league = require('../league.js');
const _ = require('lodash');

//------------------------------------------------------------------------------
function nomination(bot, message) {
    bot.reply(message, "Use this link to nominate your choice: {}".format(message.league.options.links.nominate));
}

//------------------------------------------------------------------------------
function notification(bot, message) {
    bot.reply(message, "Use this link to set your notifications preferences: {}".format(message.league.options.links.notifications));
}

//------------------------------------------------------------------------------
function availability(bot, message) {
    bot.reply(message, "Use this link to set your availability: {}".format(message.league.options.links.availability));
}

//------------------------------------------------------------------------------
function linkAccounts(bot, message) {
    var slackUser = bot.getSlackUserFromNameOrID(message.user);
    var leagues = league.getAllLeagues(bot, bot.config);
    var heltourOptions = leagues[0].options.heltour;
    heltour.linkSlack(heltourOptions, message.user, slackUser.profile['display_name'] || slackUser.profile['real_name']).then(function(result) {
        bot.api.im.open({ user: message.user }, function(err, channel) {
            if (err) return;
    
            var channel = channel.channel.id;
            var text = "";
            
            _.each(result.already_linked, function(username) {
                text += "Your Slack account is already linked with the Lichess account <https://lichess.org/@/{0}|{0}>.\n".format(username);
            });

            if (result.already_linked.length > 0) {
                text += "<{}|Click here> to link another Lichess account.\n".format(result.url);
            } else {
                text += "<{}|Click here> to link your Slack and Lichess accounts.\n".format(result.url);
            }
    
            bot.say({
                channel: channel,
                text: text,
                attachments: []
            });
        });
    });
}


exports.nomination = nomination;
exports.notification = notification;
exports.availability = availability;
exports.linkAccounts = linkAccounts;
