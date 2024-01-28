const { Job } = require("../db");

const readCsvToJson = require("./readCsv");

const uploadCsv = async () => {
  try {
    const jsonData = await readCsvToJson("jobs.csv");
    const data = jsonData.map((info) => ({
      id: info.id,
      job: info.job,
    }));
    if (data) {
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
  return await Job.findAll({});
};

const getAllJobs = async (req, res) => {
  try {
    const jobsDB = await getDbInfo();

    if (jobsDB.length === 0) {
      // No hay datos en la base de datos
      return { message: "No se encontraron datos en la base de datos." };
    }

    const infoTotal = jobsDB;

    return infoTotal;
  } catch (error) {
    console.error(error);
  }
};

async function findJobById(id) {
  try {
    const job = await Job.findByPk(id);

    if (job) {
      return job;
    } else {
      throw new Error("Job not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { getAllJobs, uploadCsv, findJobById };
