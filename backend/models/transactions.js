const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transactions', {
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
    transaction_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      unique: "transaction_id"
    },
    total_amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    total_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    shipping: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    tax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'transactions',
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
        name: "transaction_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "transaction_id" },
        ]
      },
      {
        name: "idx_transaction_session",
        using: "BTREE",
        fields: [
          { name: "session_id" },
        ]
      },
    ]
  });
};
