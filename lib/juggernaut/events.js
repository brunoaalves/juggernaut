var redis   = require("./redis");

Events = module.exports = {};

Events.client = redis.createClient();

Events.publish = function(key, value){
  this.client.publish(
    "juggernaut:" + key, 
    JSON.stringify(value)
  );
};

Events.subscribe = function(channel, client) {
  this.publish(
    "subscribe", 
    {
      channel:    channel.name,
      meta:       client.meta,
      session_id: client.session_id
    }
  );
    
  Events.client.sadd("online_users",channel.name.substring(7,channel.name.size)); //channel name is channel1 for example so we exclude the channel word with substring
};

Events.unsubscribe = function(channel, client) {
  this.publish(
    "unsubscribe",
    {
      channel:    channel.name,
      meta:       client.meta,
      session_id: client.session_id
    }
  ); 
   Events.client.srem("online_users",channel.name.substring(7,channel.name.size)); //channel name is channel1 for example so we exclude the channel word with substring
};

Events.custom = function(client, data) {
  this.publish(
    "custom", 
    {
      meta:       client.meta,
      session_id: client.session_id,
      data:       data
    }
  );
};