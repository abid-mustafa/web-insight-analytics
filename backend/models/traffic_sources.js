const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('traffic_sources', {
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
    source: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    medium: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    campaign: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'traffic_sources',
    timestamps: true,
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
        name: "idx_traffic_session",
        using: "BTREE",
        fields: [
          { name: "session_id" },
        ]
      },
    ]
  });
};
