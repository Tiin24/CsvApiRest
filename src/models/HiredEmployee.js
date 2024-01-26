const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('HiredEmployee', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        datetime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        department_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        job_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
    })
};