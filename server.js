/**
* @fileoverview Defines routes, paths and nodejs server configs with expressjs.
* @project It Manager - https://it-infrastructure-manager.onrender.com
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2021-12-17
* @updated 2024-05-19
* @supported DESKTOP
* @file server.js
* @version 0.0.3
*/

// Dependencies.
const controller = require ("./vendors/controller.js");
const parser = require ("body-parser");
const express = require ("express");
const app = express ();
const port = 5700;

// App configurations.
app.use (parser.urlencoded ({extended: true}));
app.use (express.static (__dirname));
app.use (parser.json ());

// App routes.
app.get ('/', (_, res) => res.sendFile ("index.html", {root: __dirname}));
// For `availables-equipments` operation.
app.get (
	"/eq-availables",
	(_, res) => controller.load_availables_equipments (
		result => res.send (result)
	)
);
// For `maintenance-equipments` operation.
app.get (
	"/eq-maintenance",
	(_, res) => controller.load_maintenance_equipments (
		result => res.send (result)
	)
);
// For `services-equipments` operation.
app.get (
	"/eq-service",
	(_, res) => controller.load_service_equipments (
		result => res.send (result)
	)
);
// For `services-availables` operation.
app.get (
	"/svc-availables",
	(_, res) => controller.load_availables_services (
		null, result => res.send (result)
	)
);
// For `services-running` operation.
app.get (
	"/svc-running",
	(_, res) => controller.load_running_services (
		result => res.send (result)
	)
);
// For `services-expired` operation.
app.get (
	"/svc-expired",
	(_, res) => controller.load_expired_services (
		result => res.send (result)
	)
);
// For `users-availables` operation.
app.get (
	"/users-availables",
	(_, res) => controller.load_availables_users (
		null, result => res.send (result)
	)
);
// For `users-affected` operation.
app.get (
	"/users-affected",
	(_, res) => controller.load_affected_users (
		result => res.send (result)
	)
);
// For `availables-problems` operation.
app.get (
	"/pb-availables",
	(_, res) => controller.load_availables_problems (
		result => res.send (result)
	)
);
// For `goods-providers` operation.
app.get (
	"/goods-providers",
	(_, res) => controller.load_goods_providers (
		result => res.send (result)
	)
);
// For `bads-providers` operation.
app.get (
	"/bads-providers",
	(_, res) => controller.load_bads_providers (
		result => res.send (result)
	)
);
// For `add-equipment` operation.
app.post (
	"/add-equipment",
	(req, res) => controller.add_equipment (
		req.body.data, result => res.send (result)
	)
);
// For `services-availables` operation.
app.post (
	"/svc-availables",
	(req, res) => controller.load_availables_services (
		req.body.eq_id, result => res.send (result)
	)
);
// For `add-service` operation.
app.post (
	"/add-service",
	(req, res) => controller.add_service (
		req.body.data, result => res.send (result)
	)
);
// For `assignment` operation.
app.post (
	"/assignment",
	(req, res) => controller.assignment (
		req.body, result => res.send (result)
	)
);
// For `users-availables` operation.
app.post (
	"/users-availables",
	(req, res) => controller.load_availables_users (
		req.body.eq_id, result => res.send (result)
	)
);
// For `add-user` operation.
app.post (
	"/add-user",
	(req, res) => controller.add_user (
		req.body.data, result => res.send (result)
	)
);
// For `unassignment` operation.
app.post (
	"/unassignment",
	(req, res) => controller.unassignment (
		req.body, result => res.send (result)
	)
);
// For `add-problem` operation.
app.post (
	"/add-bug",
	(req, res) => controller.add_problem (
		req.body.data, result => res.send (result)
	)
);
// For `add-solution` operation.
app.post (
	"/add-solve",
	(req, res) => controller.add_solution (
		req.body.data, result => res.send (result)
	)
);
// For `Get-out` operation.
app.post (
	"/get-out", (req, res) => controller.get_out (
		req.body, result => res.send (result)
	)
);
// For `history` data operation.
app.post (
	"/eq-history",
	(req, res) => controller.load_history_data (
		req.body.eq_id, result => res.send (result)
	)
);
// For availables equipments on a service.
app.post (
	"/eq-sv-availables",
	(req, res) => controller.load_allowed_service_equipments (
		req.body, result => res.send (result)
	)
);
// For `sign up` operation.
app.post (
	"/sign-up",
	(req, res) => controller.sign_up (
		req.body.data, result => res.send (result)
	)
);
// For `sign in` operation.
app.post (
	"/sign-in",
	(req, res) => controller.sign_in (
		req.body.data, result => res.send (result)
	)
);

// Starts the server.
app.listen (port, err => {
	// Whether an error is thrown.
	if (err) {
		// Displays this error message.
		console.error ("Server Error: ", err);
	// Otherwise.
	} else {
		// Makes a warn about server starting.
		console.log (
			"Server started at port: ", port
		);
	}
});
