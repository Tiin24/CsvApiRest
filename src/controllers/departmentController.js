const { Department } = require('../db');  

const readCsvToJson = require('./readCsv');

const uploadCsv = async () => {
    try {
        const jsonData = await readCsvToJson('departments.csv');
        const data = jsonData.map((depto) => ({
           id: depto.id,
           department: depto.department
        }))
        if (data) {
            console.log(data, 'Datos después de ajustar el acceso');
            return data;
        } else {
            console.log('No se encontraron datos válidos en el archivo CSV');
            return [];
        }
    } catch (error) {
        console.log(error)
    }
};

const getDbInfo = async () => {
    return await Department.findAll({})
}

const getAllDepartments = async (req, res) => {
    try {
        const DepartmentsFromDb = await getDbInfo();
  
        if (DepartmentsFromDb.length === 0) {
            // No hay datos en la base de datos
            return { message: 'No se encontraron datos en la base de datos.' }
        }
  
        const infoTotal = DepartmentsFromDb;
  
        return infoTotal;
    } catch (error) {
        console.error(error);
    }
};

async function findDepartmentById(id) {
    try {
        const department = await Department.findByPk(id);

        if (department) {
            return department;
        } else {
            throw new Error('Department not found');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}






module.exports = {findDepartmentById,uploadCsv , getAllDepartments ,};