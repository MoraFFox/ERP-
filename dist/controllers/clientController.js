"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const clientService_1 = require("../services/clientService");
const client_1 = require("../validation/client");
class ClientController {
    static async createClient(req, res, next) {
        try {
            const { error, value } = client_1.createClientSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }
            const client = await clientService_1.ClientService.createClient(value, req.user.userId);
            res.status(201).json({
                success: true,
                message: "Client created successfully",
                data: client,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getClient(req, res, next) {
        try {
            const { id } = req.params;
            const client = await clientService_1.ClientService.getClientById(id);
            res.status(200).json({
                success: true,
                data: client,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getClients(req, res, next) {
        try {
            const { error, value } = client_1.clientQuerySchema.validate(req.query);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }
            const result = await clientService_1.ClientService.getClients(value);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateClient(req, res, next) {
        try {
            const { id } = req.params;
            const { error, value } = client_1.updateClientSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }
            const client = await clientService_1.ClientService.updateClient(id, value);
            res.status(200).json({
                success: true,
                message: "Client updated successfully",
                data: client,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteClient(req, res, next) {
        try {
            const { id } = req.params;
            await clientService_1.ClientService.deleteClient(id);
            res.status(200).json({
                success: true,
                message: "Client deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ClientController = ClientController;
//# sourceMappingURL=clientController.js.map