const Organization = require('../models/Organization'); // Import your Organization model

class OrganizationController {
  // Create a new organization
  static async createOrganization(req, res) {
    try {
      const { name, organizationId } = req.body; // Destructure the request body

      // Check for duplicate organization name
      const existingName = await Organization.findOne({ name });
      if (existingName) {
        return res.status(400).json({ message: 'Duplicate organization name' });
      }

      // Check for duplicate organization ID
      const existingId = await Organization.findOne({ organizationId });
      if (existingId) {
        return res.status(400).json({ message: 'Duplicate organization ID' });
      }

      const newOrganization = new Organization({ name, organizationId });
      await newOrganization.save();
      res.status(201).json(newOrganization);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error creating organization', error });
    }
  }

  // Get all organizations
  static async getAllOrganizations(req, res) {
   
    try {
      const organizations = await Organization.find(); 
      res.status(200).json(organizations); 
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving organizations', error }); // Handle any errors
    }
  }

  // Get a single organization by ID
  static async getOrganizationById(req, res) {
    try {
      const { id } = req.params;
      const organization = await Organization.findById(id);
      if (!organization) {
        return res.status(404).json({ message: 'Organization not found' });
      }
      res.status(200).json(organization);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving organization', error });
    }
  }

  // Update an organization
  static async updateOrganization(req, res) {
    try {
      const { id } = req.params;
      const updatedOrganization = await Organization.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!updatedOrganization) {
        return res.status(404).json({ message: 'Organization not found' });
      }
      res.status(200).json(updatedOrganization);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error updating organization', error });
    }
  }

  // Delete an organization
  static async deleteOrganization(req, res) {
    try {
      const { id } = req.params;
      const deletedOrganization = await Organization.findByIdAndDelete(id);
      if (!deletedOrganization) {
        return res.status(404).json({ message: 'Organization not found' });
      }
      res.status(204).send(); // No content
    } catch (error) {
      res.status(500).json({ message: 'Error deleting organization', error });
    }
  }
}

module.exports = OrganizationController;
