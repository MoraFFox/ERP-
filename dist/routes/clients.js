"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientController_1 = require("../controllers/clientController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.post("/", clientController_1.ClientController.createClient);
router.get("/", clientController_1.ClientController.getClients);
router.get("/:id", clientController_1.ClientController.getClient);
router.put("/:id", clientController_1.ClientController.updateClient);
router.delete("/:id", clientController_1.ClientController.deleteClient);
exports.default = router;
//# sourceMappingURL=clients.js.map