const { HiredEmployee,Job,Department} = require('../db');  
const router = require('../routes');

const readCsvToJson = require('./readCsv');

const uploadCsv = async () => {
    try {
        const jsonData = await readCsvToJson('hired_employees.csv');
        console.log('Datos antes de la inserción:', jsonData);
        const dataPromises = jsonData.map(async (info) => {
            // Aquí debes buscar el departamento y el trabajo por id para asegurarte de que existen
            const department = await Department.findByPk(info.department_id);
            const job = await Job.findByPk(info.job_id);

            console.log(department, 'hoa')
            console.log(job, "hoa")

            if (!department || !job) {
                console.log('Departamento o trabajo no encontrado para el id:', info.id);
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

        const data = (await Promise.all(dataPromises)).filter(item => item !== null);

        if (data.length > 0) {
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
    return await HiredEmployee.findAll({})
}

const getAllHiredEmployee = async (req, res) => {
  try {
      const hiredEmployeeFromDb = await getDbInfo();

      if (hiredEmployeeFromDb.length === 0) {
          // No hay datos en la base de datos
          return res.status(404).json({ message: 'No se encontraron datos en la base de datos.' });
      }

      const infoTotal = hiredEmployeeFromDb;

      return infoTotal;
  } catch (error) {
      console.error(error);s
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

async function findHiredEmployeeById(id) {
    try {
        const hiredEmployee = await HiredEmployee.findByPk(id);

        if (hiredEmployee) {
            return hiredEmployee;
        } else {
            throw new Error('hiredEmployee not found');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function getQuarter(date) {
    const month = date.getMonth() + 1; // Mes basado en cero
    return Math.ceil(month / 3);
  }

async function hiredEmployeeMetricsByQuarter() {
  try {
    const info = await getDbInfo(); // Asegúrate de que getDbInfo sea asíncrono y devuelva una promesa

    const result = [];

    // Itera sobre los empleados contratados
    for (const employee of info) {
      const { department_id, job_id, datetime } = employee;
      const quarter = getQuarter(new Date(datetime));

      // Busca la entrada correspondiente en result
      const entry = result.find((item) => item.department === department_id && item.job_id === job_id);

      if (entry) {
        // Si ya existe, actualiza el trimestre correspondiente
        entry[quarter] = (entry[quarter] || 0) + 1;
      } else {
        // Si no existe, crea una nueva entrada en result
        const department = await Department.findByPk(department_id);
        const job = await Job.findByPk(job_id);

        if (!department || !job) {
          console.log('Departamento o trabajo no encontrado para el id:', department_id, job_id);
          continue; // Pasa a la siguiente iteración si no se encuentra el departamento o trabajo
        }

        const newEntry = {
          department: department.department,
          job: job.job,
          Q1: 0,
          Q2: 0,
          Q3: 0,
          Q4: 0,
        };
        newEntry[quarter] = 1;
        result.push(newEntry);
      }
    }

    // Ordena el resultado por departamento y puesto de trabajo
    result.sort((a, b) => {
      if (a.department !== b.department) {
        return a.department.localeCompare(b.department);
      }
      return a.job.localeCompare(b.job);
    });

    return result;
  } catch (error) {
    throw error;
  }
    
  }

  async function departmentsAboveAverage() {
    try {
      const info = await getDbInfo(); // Asegúrate de que getDbInfo sea asíncrono y devuelva una promesa
  
      // Calcular la media de empleados contratados en 2021
      const totalEmployees = info.length;
      const averageEmployees = totalEmployees / info.length;
  
      // Contar el número de empleados contratados por departamento
      const departmentCounts = {};
      for (const employee of info) {
        const { department_id } = employee;
        departmentCounts[department_id] = (departmentCounts[department_id] || 0) + 1;
      }
  
      // Filtrar los departamentos que contrataron más que la media
      const aboveAverageDepartments = Object.entries(departmentCounts)
        .filter(([department_id, count]) => count > averageEmployees)
        .map(([department_id, count, name]) => ({
          id: department_id,
          hired: count,
        }));
  
      // Obtener información detallada de los departamentos
      const detailedDepartments = await Promise.all(
        aboveAverageDepartments.map(async (department) => {
          const departmentInfo = await Department.findByPk(department.id);
          return {
            ...department,
            department: departmentInfo ? departmentInfo.department : null,
          };
        })
      );
  
      // Ordenar por el número de empleados contratados (descendente)
      detailedDepartments.sort((a, b) => b.hired - a.hired);
  
      return detailedDepartments;
    } catch (error) {
      throw error;
    }
  }
  


module.exports = { uploadCsv ,findHiredEmployeeById,getAllHiredEmployee, hiredEmployeeMetricsByQuarter, departmentsAboveAverage }