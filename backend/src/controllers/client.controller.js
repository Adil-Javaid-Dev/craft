// controllers/clientController.js
import { ClientService } from "../services/client.service.js";

export class ClientController {
  // Create a new client
  static async createClient(req, res) {
    try {
      const clientData = req.body;
      const userId = req.user._id; // From authentication middleware

      // Add createdBy to the client data
      const client = await ClientService.createClient({
        ...clientData,
        createdBy: userId,
      });

      res.status(201).json({
        success: true,
        message: "Client created successfully",
        data: client,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  // Get all clients
  static async getClients(req, res) {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const filters = {};

      if (status) filters.status = status;
      if (search) filters.search = search;

      const result = await ClientService.getClients(filters, page, limit);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get client by ID
  static async getClient(req, res) {
    try {
      const { id } = req.params;
      const client = await ClientService.getClientById(id);

      res.status(200).json({
        success: true,
        data: client,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update client
  static async updateClient(req, res) {
    try {
      const { id } = req.params;
      const clientData = req.body;

      const client = await ClientService.updateClient(id, clientData);

      res.status(200).json({
        success: true,
        message: "Client updated successfully",
        data: client,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update client status
  static async updateClientStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be either 'active' or 'inactive'",
        });
      }

      const client = await ClientService.updateClientStatus(id, status);

      res.status(200).json({
        success: true,
        message: `Client status updated to ${status}`,
        data: client,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete client
  static async deleteClient(req, res) {
    try {
      const { id } = req.params;

      await ClientService.deleteClient(id);

      res.status(200).json({
        success: true,
        message: "Client deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Upload document
  static async uploadDocument(req, res) {
    try {
      const { id, documentType } = req.params;

      if (!req.files || !req.files.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const validDocumentTypes = [
        "driversLicense",
        "proofOfSS",
        "proofOfAddress",
        "ftcReport",
      ];
      if (!validDocumentTypes.includes(documentType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid document type",
        });
      }

      const result = await ClientService.uploadDocument(
        id,
        documentType,
        req.files.file
      );

      res.status(200).json({
        success: true,
        message: "Document uploaded successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Download document
  static async downloadDocument(req, res) {
    try {
      const { id, documentType } = req.params;

      const document = await ClientService.getDocument(id, documentType);

      res.download(document.filePath, document.originalName);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}