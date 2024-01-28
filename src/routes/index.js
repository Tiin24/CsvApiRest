const { Router } = require("express");
const router = Router();

const routeDepartment = require("./department.js");
const RouteJob = require("./job.js");
const RouteHired = require("./hiredEmployee.js");
const RouteMetrics = require("./metrics.js");

router.use("/departments", routeDepartment);
router.use("/jobs", RouteJob);
router.use("/hiredEmployee", RouteHired);
router.use("/metrics", RouteMetrics);

module.exports = router;
