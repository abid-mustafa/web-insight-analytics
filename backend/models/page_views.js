const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('page_views', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    session_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'sessions',
        key: 'id'
      }
    },
    page_title: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    page_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    referrer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'page_views',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_pageviews_session",
        using: "BTREE",
        fields: [
          { name: "session_id" },
        ]
      },
    ]
  });
};
