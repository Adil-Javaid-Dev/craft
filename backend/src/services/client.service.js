// services/clientService.js
import Client from "../models/Client.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

export class ClientService {
  // Create a new client
  static async createClient(clientData, userId) {
    try {
      // Check if client with email already exists
      const existingClient = await Client.findOne({ email: clientData.email.toLowerCase() });
      if (existingClient) {
        throw new Error("Client with this email already exists");
      }

      const client = new Client({
        ...clientData,
        createdBy: userId,
        status: "inactive" // Default status
      });

      return await client.save();
    } catch (error) {
      throw error;
    }
  }

  // Get all clients with optional filtering and pagination
  static async getClients(filters = {}, page = 1, limit = 10) {
    try {
      const query = {};
      
      // Apply filters
      if (filters.status) query.status = filters.status;
      if (filters.search) {
        query.$or = [
          { firstName: { $regex: filters.search, $options: "i" } },
          { lastName: { $regex: filters.search, $options: "i" } },
          { email: { $regex: filters.search, $options: "i" } }
        ];
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: { path: "createdBy", select: "firstName lastName email" }
      };

      // Using mongoose-paginate-v2 would be ideal here
      const clients = await Client.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort(options.sort)
        .populate(options.populate);

      const total = await Client.countDocuments(query);

      return {
        clients,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      throw error;
    }
  }

  // Get client by ID
  static async getClientById(id) {
    try {
      const client = await Client.findById(id).populate("createdBy", "firstName lastName email");
      if (!client) {
        throw new Error("Client not found");
      }
      return client;
    } catch (error) {
      throw error;
    }
  }

  // Update client
  static async updateClient(id, clientData) {
    try {
      // Don't allow updating email if it already exists for another client
      if (clientData.email) {
        const existingClient = await Client.findOne({ 
          email: clientData.email.toLowerCase(), 
          _id: { $ne: id } 
        });
        
        if (existingClient) {
          throw new Error("Another client with this email already exists");
        }
      }

      const client = await Client.findByIdAndUpdate(
        id,
        { ...clientData },
        { new: true, runValidators: true }
      ).populate("createdBy", "firstName lastName email");

      if (!client) {
        throw new Error("Client not found");
      }

      return client;
    } catch (error) {
      throw error;
    }
  }

  // Update client status
  static async updateClientStatus(id, status) {
    try {
      const client = await Client.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!client) {
        throw new Error("Client not found");
      }

      return client;
    } catch (error) {
      throw error;
    }
  }

  // Delete client
  static async deleteClient(id) {
    try {
      const client = await Client.findByIdAndDelete(id);
      
      if (!client) {
        throw new Error("Client not found");
      }

      // Delete associated files
      await this.deleteClientFiles(client);

      return client;
    } catch (error) {
      throw error;
    }
  }

  // Upload document for client
  static async uploadDocument(clientId, documentType, file) {
    try {
      if (!file) {
        throw new Error("No file provided");
      }

      const client = await Client.findById(clientId);
      if (!client) {
        throw new Error("Client not found");
      }

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const filename = `${uuidv4()}${fileExtension}`;
      
      // Define upload path (you might want to use cloud storage in production)
      const uploadDir = path.join(process.cwd(), "uploads", "clients", clientId);
      
      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);

      // Move file to upload directory
      fs.renameSync(file.path, filePath);

      // Update client document reference
      client.documents[documentType] = {
        filename,
        originalName: file.originalname,
        size: file.size,
        uploadedAt: new Date()
      };

      await client.save();

      return {
        success: true,
        document: client.documents[documentType]
      };
    } catch (error) {
      throw error;
    }
  }

  // Get document
  static async getDocument(clientId, documentType) {
    try {
      const client = await Client.findById(clientId);
      if (!client || !client.documents[documentType]) {
        throw new Error("Document not found");
      }

      const document = client.documents[documentType];
      const filePath = path.join(
        process.cwd(), 
        "uploads", 
        "clients", 
        clientId, 
        document.filename
      );

      if (!fs.existsSync(filePath)) {
        throw new Error("File not found on server");
      }

      return {
        filePath,
        originalName: document.originalName,
        filename: document.filename
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete client files (helper method)
  static async deleteClientFiles(client) {
    try {
      const clientDir = path.join(process.cwd(), "uploads", "clients", client._id.toString());
      
      if (fs.existsSync(clientDir)) {
        fs.rmSync(clientDir, { recursive: true, force: true });
      }
    } catch (error) {
      console.error("Error deleting client files:", error);
    }
  }
}