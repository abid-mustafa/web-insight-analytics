var DataTypes = require("sequelize").DataTypes;
var _events = require("./events");
var _items = require("./items");
var _page_views = require("./page_views");
var _sessions = require("./sessions");
var _traffic_sources = require("./traffic_sources");
var _transactions = require("./transactions");
var _users = require("./users");
var _visitors = require("./visitors");
var _websites = require("./websites");

function initModels(sequelize) {
  var events = _events(sequelize, DataTypes);
  var items = _items(sequelize, DataTypes);
  var page_views = _page_views(sequelize, DataTypes);
  var sessions = _sessions(sequelize, DataTypes);
  var traffic_sources = _traffic_sources(sequelize, DataTypes);
  var transactions = _transactions(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var visitors = _visitors(sequelize, DataTypes);
  var websites = _websites(sequelize, DataTypes);

  events.belongsTo(sessions, { as: "session", foreignKey: "session_id"});
  sessions.hasMany(events, { as: "events", foreignKey: "session_id"});
  page_views.belongsTo(sessions, { as: "session", foreignKey: "session_id"});
  sessions.hasMany(page_views, { as: "page_views", foreignKey: "session_id"});
  traffic_sources.belongsTo(sessions, { as: "session", foreignKey: "session_id"});
  sessions.hasMany(traffic_sources, { as: "traffic_sources", foreignKey: "session_id"});
  transactions.belongsTo(sessions, { as: "session", foreignKey: "session_id"});
  sessions.hasMany(transactions, { as: "transactions", foreignKey: "session_id"});
  items.belongsTo(transactions, { as: "transaction", foreignKey: "transaction_id"});
  transactions.hasMany(items, { as: "items", foreignKey: "transaction_id"});
  websites.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(websites, { as: "websites", foreignKey: "user_id"});
  sessions.belongsTo(visitors, { as: "visitor", foreignKey: "visitor_id"});
  visitors.hasMany(sessions, { as: "sessions", foreignKey: "visitor_id"});
  sessions.belongsTo(websites, { as: "website", foreignKey: "website_id"});
  websites.hasMany(sessions, { as: "sessions", foreignKey: "website_id"});
  visitors.belongsTo(websites, { as: "website", foreignKey: "website_id"});
  websites.hasMany(visitors, { as: "visitors", foreignKey: "website_id"});

  return {
    events,
    items,
    page_views,
    sessions,
    traffic_sources,
    transactions,
    users,
    visitors,
    websites,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
