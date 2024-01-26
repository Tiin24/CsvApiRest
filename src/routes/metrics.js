const { Router } = require("express");
const router = Router();
const {HiredEmployee} = require('../db');
const { uploadCsv, getAllHiredEmployee, findHiredEmployeeById, hiredEmployeeMetricsByQuarter, departmentsAboveAverage } = require("../controllers/hiredEmployeeController");

router.get(`/`, async (req, res) =>{
    try {
        let info = await hiredEmployeeMetricsByQuarter()
        res.status(200).json(info)
    } catch (error) {
        console.log(error)
    }
} );

router.get('/aboveAverageDepartments', async (req, res) => {
    try {
      // Llama a la función para obtener los departamentos que contrataron más que la media
      const aboveAverageDepartments = await departmentsAboveAverage();
  
      // Formatea y envía la respuesta al cliente
      res.json(aboveAverageDepartments);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router