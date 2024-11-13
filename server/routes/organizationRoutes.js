const express = require('express');
const OrganizationController = require('../controllers/organizationController');
const Organization = require('../models/Organization');

const router = express.Router();

router.post('/', OrganizationController.createOrganization);
router.get('/', OrganizationController.getAllOrganizations);
router.get('/:id', OrganizationController.getOrganizationById);
router.put('/:id', OrganizationController.updateOrganization);
router.delete('/:id', OrganizationController.deleteOrganization);

// Get all active organizations
router.get('/', async (req, res) => {
  try {
    const organizations = await Organization.find({ status: 'active' })
      .select('name type')
      .sort({ name: 1 });
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

module.exports = router;
