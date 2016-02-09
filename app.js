"use strict";

var sdk = require("matrix-js-sdk");
var config = require("./config");
var client = sdk.createClient({
    baseUrl: config.baseUrl,
    accessToken: config.accessToken,
    userId: config.userId
});
var plugins = {};

// TODO: include your plugin here
var DummyPlugin = require('./plugins/dummy');
var addPlugins = function() {
    // TODO: add your plugin
    plugins[DummyPlugin.name.toLowerCase()] = new DummyPlugin();
}

var parseMessage = function(event) {
    var body = event.getContent().body;
    if (event.getSender() === config.userId || event.getType() === "m.notice") {
        return;
    }

    if (body.charAt(0) === '!') {
        var segments = body.split(" ");
        var cmd = segments[0].slice(1);
        if (cmd === "help") {

        }
        else {
            if (plugins.hasOwnProperty(cmd)) {
                if (segments.length > 1) {
                    if (plugins[cmd][segments[1]] != null) {
                        var res = plugins[cmd][segments[1]](event, segments.slice(2));
                        
                        if (res) {
                            client.sendMessage(event.getRoomId(), {
                                msgtype: "m.text",
                                body: res
                            });
                        }
                    }
                }
            }    
        }
    }
};

var parseMembership = function(event, member) {
    if (member.membership === "invite") {
        if (config.admins.indexOf(member.userId) != -1) {
            client.joinRoom(member.roomId).done(function() {
                console.log("Auto-joined %s", member.roomId);
            });
        }
        else {
            console.log("Refusing invite, %s not in admin list.", member.userId);
        }
    }
};

client.on("RoomMember.membership", function(event, member) {
    parseMembership(event, member);
});

client.on("Room.timeline", function(event, room, toStartOfTimeline) {
    if (toStartOfTimeline) {
        return; // don't print paginated results
    }

    if (event.getType() === "m.room.message") {
        parseMessage(event);      
    }
    else if (event.getType() === "m.room.member") {
        parseMembership(event);
    }
    else {

    }
});

addPlugins();
client.startClient();
