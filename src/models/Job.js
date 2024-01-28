const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Job", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    job: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
