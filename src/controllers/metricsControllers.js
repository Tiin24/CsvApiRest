const { HiredEmployee, Job, Department } = require("../db");
const { getDbInfo } = require("./hiredEmployeeController");

// Obtengo el nombre del departamento por ID
async function getDepartmentName(departmentId) {
  const department = await Department.findByPk(departmentId);
  console.log(department);
  return department ? department.department : null;
}

// Obtengo el nombre del trabajo por ID
async function getJobName(jobId) {
  const job = await Job.findByPk(jobId);
  console.log(job);
  return job ? job.job : null;
}

async function hiredEmployeeMetricsByQuarter() {
  try {
    // traigo la info de hiredEmployeed
    const info = await getDbInfo();

    // traigo todos los empleados contratados en 2021
    const hiredIn2021 = info.filter((employee) => {
      const hireDate = new Date(employee.datetime);
      return hireDate.getFullYear() === 2021;
    });

    const quarters = ["Q1", "Q2", "Q3", "Q4"];

    const metricsByJobAndDept = await hiredIn2021.reduce(
      async (resPromise, employee) => {
        // Esperar el valor previo del acumulador
        const res = await resPromise;

        // Encontrar y extraer los nombres
        const departmentName = await getDepartmentName(employee.department_id);
        const jobName = await getJobName(employee.job_id);

        // Obtener el trimestre en el que fue contratado el empleado
        const quarter = getQuarter(employee.datetime);

        // Crear o actualizar las propiedades 'department' y 'job' en el acumulador
        res["department"] = res["department"] || [];
        res["job"] = res["job"] || [];

        // Agregar el departamento al conjunto para evitar duplicados
        res["department"].push(departmentName);

        // Agregar el trabajo al conjunto para evitar duplicados
        res["job"].push(jobName);

        // Inicializar cada trimestre con un valor de 0
        quarters.forEach((q) => {
          res[q] = res[q] || 0;
        });

        // Incrementar el contador para el trimestre actual
        res[quarter] += 1;

        // Devolver el acumulador actualizado
        return res;
      },
      Promise.resolve({})
    );

    // Ordenar alfabéticamente los conjuntos 'department' y 'job'
    const sortedMetricsByJobAndDept = sortMetrics(metricsByJobAndDept);

    // Imprimir o devolver el resultado ordenado
    return sortedMetricsByJobAndDept;
  } catch (error) {
    // Manejar errores
    throw error;
  }
}

// Función para ordenar alfabéticamente los conjuntos 'department' y 'job'
function sortMetrics(metrics) {
  return {
    department: metrics["department"] ? metrics["department"].sort() : [],
    job: metrics["job"] ? metrics["job"].sort() : [],
    Q1: metrics["Q1"] || 0,
    Q2: metrics["Q2"] || 0,
    Q3: metrics["Q3"] || 0,
    Q4: metrics["Q4"] || 0,
  };
}

// Función para obtener el trimestre a partir de una fecha
function getQuarter(date) {
  const month = date.getMonth() + 1;
  if (month >= 1 && month <= 3) {
    return "Q1";
  } else if (month >= 4 && month <= 6) {
    return "Q2";
  } else if (month >= 7 && month <= 9) {
    return "Q3";
  } else {
    return "Q4";
  }
}

async function departmentsAboveAverage() {
  try {
    const info = await getDbInfo();

    // Calculo la media de empleados contratados en 2021
    const totalEmployees = info.length;
    const averageEmployees = totalEmployees / info.length;

    // Cuento el número de empleados contratados por departamento
    const departmentCounts = {};
    for (const employee of info) {
      const { department_id } = employee;
      departmentCounts[department_id] =
        (departmentCounts[department_id] || 0) + 1;
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

module.exports = {
  departmentsAboveAverage,
  hiredEmployeeMetricsByQuarter,
};
