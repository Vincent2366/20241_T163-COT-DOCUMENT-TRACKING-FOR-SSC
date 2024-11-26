adminHandler={}

const Organization = require('../models/Organization');
const User = require('../models/UsersModel');

adminHandler.getPendingUsers = async (req, res) =>{
    try {
        const pendingUsers = await User.find({ status: 'pending' });
        res.json(pendingUsers);
    } catch (error) {
        console.error('Error fetching pending users:', error);
        res.status(500).json({ error: error.message });
    }
}

adminHandler.organizations = async (req, res) => {
    try {
        const {
            name,
            orgType,
            college,
            president,
            adviser,
            academicYear
        } = req.body;
        
        const organization = new Organization({
            name,
            orgType,
            college,
            president,
            adviser,
            academicYear
        });

        await organization.save();
        res.status(201).json({
            message: 'Student organization registered successfully',
            organization
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

adminHandler.userApprove = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { status: 'active' },
            { new: true }
        ).exec();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ 
            message: 'User approved successfully',
            user 
        });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ error: error.message });
    }
}

adminHandler.organizations = async (req, res) => {
    try {
        const organizations = await Organization.find({});
        res.json(organizations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


adminHandler.organizationsStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const organization = await Organization.findById(req.params.orgId);
        
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        organization.status = status;
        await organization.save();

        res.json({
            message: 'Organization status updated successfully',
            organization
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = adminHandler