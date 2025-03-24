const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('visitors', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    visitor_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      unique: "visitor_id"
    },
    website_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'websites',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'visitors',
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
        name: "visitor_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "visitor_id" },
        ]
      },
      {
        name: "visitors_fk_website",
        using: "BTREE",
        fields: [
          { name: "website_id" },
        ]
      },
    ]
  });
};
