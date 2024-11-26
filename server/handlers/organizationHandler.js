organizationHandler={}

const Organization = require('../models/Organization');

organizationHandler.getOrganization = async (req, res) => {
    try {
      const organizations = await Organization.find({ status: 'active' })
        .select('name type')
        .sort({ name: 1 });
      res.json(organizations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch organizations' });
    }
  }

module.exports = organizationHandler;