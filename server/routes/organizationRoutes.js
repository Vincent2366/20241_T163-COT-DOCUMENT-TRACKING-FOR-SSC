const express = require('express');
const OrganizationController = require('../controllers/OrganizationController');

const router = express.Router();

router.post('/', OrganizationController.createOrganization);
router.get('/', OrganizationController.getAllOrganizations);
router.get('/:id', OrganizationController.getOrganizationById);
router.put('/:id', OrganizationController.updateOrganization);
router.delete('/:id', OrganizationController.deleteOrganization);

module.exports = router;
