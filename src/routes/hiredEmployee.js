const { Router } = require("express");
const router = Router();
const {HiredEmployee} = require('../db');
const { uploadCsv, getAllHiredEmployee, findHiredEmployeeById, hiredEmployeeMetricsByQuarter } = require("../controllers/hiredEmployeeController");

router.get(`/`, async (req, res) =>{
    try {
        let info = await getAllHiredEmployee()
        res.status(200).json(info)
    } catch (error) {
        console.log(error)
    }
} );

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Utilizar la función findjobById para encontrar el job por ID
        const hired = await findHiredEmployeeById(id);

        // Enviar el job como respuesta
        res.status(200).json(hired);
    } catch (error) {
        // Manejar errores y enviar una respuesta de error
        console.error(error);
        if (error.message === 'Hired not found') {
            res.status(404).json({ error: 'Hired not found' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

router.post('/', async (req,res) => {
    try {
        const hiredData = await uploadCsv(); // Obtener datos de la función getAllDepartments
        console.log('jaosdjfoasdf',hiredData)
        // Crear departamentos en la base de datos utilizando los datos obtenidos
        const createdHired = await HiredEmployee.bulkCreate(hiredData);

        res.status(201).json(createdHired); // Devolver los departamentos creados con un código de estado 201 (Created)
    } catch (error) {
        // Manejar errores y enviar una respuesta de error
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})




module.exports = router