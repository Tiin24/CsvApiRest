const { Router } = require("express");
const router = Router();
const { getAllJobs ,uploadCsv, findJobById} = require('../controllers/jobsController');
const {Job} = require('../db')

router.get(`/`, async (req, res) =>{
    try {
        let info = await getAllJobs()
        res.status(200).json(info)
    } catch (error) {
        console.log(error)
    }
} );

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Utilizar la función findjobById para encontrar el job por ID
        const job = await findJobById(id);

        // Enviar el job como respuesta
        res.status(200).json(job);
    } catch (error) {
        // Manejar errores y enviar una respuesta de error
        console.error(error);
        if (error.message === 'job not found') {
            res.status(404).json({ error: 'job not found' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

router.post('/', async (req,res) => {
    try {
        const jobsData = await uploadCsv(); // Obtener datos de la función getAllDepartments
        // Crear departamentos en la base de datos utilizando los datos obtenidos
        const createdJobs = await Job.bulkCreate(jobsData);

        res.status(201).json(createdJobs); // Devolver los departamentos creados con un código de estado 201 (Created)
    } catch (error) {
        // Manejar errores y enviar una respuesta de error
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router

