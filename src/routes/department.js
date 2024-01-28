const { Router } = require("express");
const {
  getAllDepartments,
  updateDepartmentById,
  deleteDepartmentById,
  uploadCsv,
  findDepartmentById,
} = require("../controllers/departmentController");
const router = Router();
const { Department } = require("../db");

router.get(`/`, async (req, res) => {
  try {
    let info = await getAllDepartments();
    res.status(200).json(info);
  } catch (error) {
    console.log(error);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Utilizar la función findDepartmentById para encontrar el departamento por ID
    const department = await findDepartmentById(id);

    // Enviar el departamento como respuesta
    res.status(200).json(department);
  } catch (error) {
    // Manejar errores y enviar una respuesta de error
    console.error(error);
    if (error.message === "Department not found") {
      res.status(404).json({ error: "Department not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});
router.post("/", async (req, res) => {
  try {
    const departmentsData = await uploadCsv(); // Obtener datos de la función getAllDepartments
    // Crear departamentos en la base de datos utilizando los datos obtenidos
    const createdDepartments = await Department.bulkCreate(departmentsData);

    res.status(201).json(createdDepartments); // Devolver los departamentos creados con un código de estado 201 (Created)
  } catch (error) {
    // Manejar errores y enviar una respuesta de error
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
