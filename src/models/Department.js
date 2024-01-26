const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Department', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      department: {
        type: DataTypes.STRING, // O el tipo de dato que estés utilizando para el campo "department"
        allowNull: false, // Asegúrate de tener allowNull configurado en false
      },
      // Otros campos de tu modelo...
    });
};