const { HiredEmployee, Job, Department } = require("../db");
const router = require("../routes");

const readCsvToJson = require("./readCsv");

const uploadCsv = async () => {
  try {
    const jsonData = await readCsvToJson("hired_employees.csv");
    console.log("Datos antes de la inserción:", jsonData);
    const dataPromises = jsonData.map(async (info) => {
      // Aquí debes buscar el departamento y el trabajo por id para asegurarte de que existen
      const department = await Department.findByPk(info.department_id);
      const job = await Job.findByPk(info.job_id);

      console.log(department, "hoa");
      console.log(job, "hoa");

      if (!department || !job) {
        console.log(
          "Departamento o trabajo no encontrado para el id:",
          info.id
        );
        return null;
      }

      return {
        id: info.id,
        name: info.name,
        datetime: info.datetime,
        department_id: department.id, // Esto asume que el modelo Department tiene un campo 'id'
        job_id: job.id, // Esto asume que el modelo Job tiene un campo 'id'
      };
    });

    const data = (await Promise.all(dataPromises)).filter(
      (item) => item !== null
    );

    if (data.length > 0) {
      console.log(data, "Datos después de ajustar el acceso");
      return data;
    } else {
      console.log("No se encontraron datos válidos en el archivo CSV");
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

const getDbInfo = async () => {
  return await HiredEmployee.findAll({});
};

const getAllHiredEmployee = async (req, res) => {
  try {
    const hiredEmployeeFromDb = await getDbInfo();

    if (hiredEmployeeFromDb.length === 0) {
      // No hay datos en la base de datos
      return res
        .status(404)
        .json({ message: "No se encontraron datos en la base de datos." });
    }

    const infoTotal = hiredEmployeeFromDb;

    return infoTotal;
  } catch (error) {
    console.error(error);
    s;
    res.status(500).json({ error: "Internal Server Error" });
  }
};

async function findHiredEmployeeById(id) {
  try {
    const hiredEmployee = await HiredEmployee.findByPk(id);

    if (hiredEmployee) {
      return hiredEmployee;
    } else {
      throw new Error("hiredEmployee not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  uploadCsv,
  findHiredEmployeeById,
  getAllHiredEmployee,
  getDbInfo,
};
