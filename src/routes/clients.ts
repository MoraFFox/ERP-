import { Router } from "express"
import { ClientController } from "../controllers/clientController"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Apply authentication to all client routes
router.use(authenticateToken)

/**
 * @route   POST /api/clients
 * @desc    Create a new client
 * @access  Private
 */
router.post("/", ClientController.createClient)

/**
 * @route   GET /api/clients
 * @desc    Get all clients with pagination and filtering
 * @access  Private
 */
router.get("/", ClientController.getClients)

/**
 * @route   GET /api/clients/:id
 * @desc    Get client by ID
 * @access  Private
 */
router.get("/:id", ClientController.getClient)

/**
 * @route   PUT /api/clients/:id
 * @desc    Update client by ID
 * @access  Private
 */
router.put("/:id", ClientController.updateClient)

/**
 * @route   DELETE /api/clients/:id
 * @desc    Delete client by ID
 * @access  Private
 */
router.delete("/:id", ClientController.deleteClient)

export default router
