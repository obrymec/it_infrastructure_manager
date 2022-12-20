// Dependencies.
const controller = require ("./vendors/controller.js");
const parser = require ("body-parser");
const port = process.env.PORT || 5000;
const express = require ("express");
const app = express ();

// App configurations.
app.use (express.static (__dirname));
app.use (parser.urlencoded ({extended: true}));
app.use (parser.json ());

// App routes.
app.get ('/', (req, res) => {res.sendFile ("index.html", {root: __dirname});});
// For "availables-equipments" operation.
app.get ("/eq-availables", (req, res) => controller.load_availables_equipments (result => res.send (result)));
// For "maintenance-equipments" operation.
app.get ("/eq-maintenance", (req, res) => controller.load_maintenance_equipments (result => res.send (result)));
// For "services-equipments" operation.
app.get ("/eq-service", (req, res) => controller.load_service_equipments (result => res.send (result)));
// For "services-availables" operation.
app.get ("/svc-availables", (req, res) => controller.load_availables_services (null, result => res.send (result)));
// For "services-running" operation.
app.get ("/svc-running", (req, res) => controller.load_running_services (result => res.send (result)));
// For "services-expired" operation.
app.get ("/svc-expired", (req, res) => controller.load_expired_services (result => res.send (result)));
// For "users-availables" operation.
app.get ("/users-availables", (req, res) => controller.load_availables_users (null, result => res.send (result)));
// For "users-affected" operation.
app.get ("/users-affected", (req, res) => controller.load_affected_users (result => res.send (result)));
// For "availables-problems" operation.
app.get ("/pb-availables", (req, res) => controller.load_availables_problems (result => res.send (result)));
// For "goods-providers" operation.
app.get ("/goods-providers", (req, res) => controller.load_goods_providers (result => res.send (result)));
// For "bads-providers" operation.
app.get ("/bads-providers", (req, res) => controller.load_bads_providers (result => res.send (result)));
// For "add-equipment" operation.
app.post ("/add-equipment", (req, res) => controller.add_equipment (req.body.data, result => res.send (result)));
// For "services-availables" operation.
app.post ("/svc-availables", (req, res) => controller.load_availables_services (req.body.eq_id, result => res.send (result)));
// For "add-service" operation.
app.post ("/add-service", (req, res) => controller.add_service (req.body.data, result => res.send (result)));
// For assignment operation.
app.post ("/assignment", (req, res) => controller.assignment (req.body, result => res.send (result)));
// For "users-availables" operation.
app.post ("/users-availables", (req, res) => controller.load_availables_users (req.body.eq_id, result => res.send (result)));
// For "add-user" operation.
app.post ("/add-user", (req, res) => controller.add_user (req.body.data, result => res.send (result)));
// For unassignment operation.
app.post ("/unassignment", (req, res) => controller.unassignment (req.body, result => res.send (result)));
// For "add-problem" operation.
app.post ("/add-bug", (req, res) => controller.add_problem (req.body.data, result => res.send (result)));
// For "add-solution" operation.
app.post ("/add-solve", (req, res) => controller.add_solution (req.body.data, result => res.send (result)));
// For "Get-out" operation.
app.post ("/get-out", (req, res) => controller.get_out (req.body, result => res.send (result)));
// For history data operation.
app.post ("/eq-history", (req, res) => controller.load_history_data (req.body.eq_id, result => res.send (result)));
// For availables equipments on a service.
app.post ("/eq-sv-availables", (req, res) => controller.load_allowed_service_equipments (req.body, result => res.send (result)));
// For sign up operation.
app.post ("/sign-up", (req, res) => controller.sign_up (req.body.data, result => res.send (result)));
// For sign in operation.
app.post ("/sign-in", (req, res) => controller.sign_in (req.body.data, result => res.send (result)));

// Server port configuration.
app.listen (port, err => {
	// Checks whether some errors has been thrown.
	if (err) console.error ("Failed to start server error code: ", err); else console.log ("Server start at port:", port);
});
