const express = require('express');
const OrganizationController = require('../controllers/organizationController');
const Organization = require('../models/Organization');
const organizationHandler = require('../handlers/organizationHandler')

const router = express.Router();

router.post('/', OrganizationController.createOrganization);
router.get('/', OrganizationController.getAllOrganizations);
router.get('/:id', OrganizationController.getOrganizationById);
router.put('/:id', OrganizationController.updateOrganization);
router.delete('/:id', OrganizationController.deleteOrganization);

// New routes for locking mechanism
router.post('/:id/lock', OrganizationController.lockOrganization);
router.post('/:id/unlock', OrganizationController.unlockOrganization);

// Get all active organizations
router.get('/', organizationHandler.getOrganization);

module.exports = router;
 