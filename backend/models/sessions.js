const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sessions', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    website_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'websites',
        key: 'id'
      }
    },
    visitor_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'visitors',
        key: 'id'
      }
    },
    session_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      unique: "session_id"
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    device: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    os: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    browser: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    session_start: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'sessions',
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
        name: "session_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "session_id" },
        ]
      },
      {
        name: "sessions_fk_website",
        using: "BTREE",
        fields: [
          { name: "website_id" },
        ]
      },
      {
        name: "sessions_fk_visitor",
        using: "BTREE",
        fields: [
          { name: "visitor_id" },
        ]
      },
    ]
  });
};
