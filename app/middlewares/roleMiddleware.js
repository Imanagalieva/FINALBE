const User = require('../models/user.model');

// Define role hierarchy and permissions
const ROLES = {
  PATIENT: 'patient',
  PREMIUM_PATIENT: 'premium_patient',
  DOCTOR: 'doctor',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

// Role-based permissions
const PERMISSIONS = {
  [ROLES.PATIENT]: {
    canViewOwnProfile: true,
    canUpdateOwnProfile: true,
    canBookAppointment: true,
    canViewOwnAppointments: true,
    canCancelOwnAppointments: true,
    canViewMedicalRecords: false,
    canDeleteAppointment: false,
    canDeleteUsers: false,
    canManageUsers: false,
    canAccessReports: false,
    canBanUsers: false,
    canModerateContent: false
  },
  [ROLES.PREMIUM_PATIENT]: {
    canViewOwnProfile: true,
    canUpdateOwnProfile: true,
    canBookAppointment: true,
    canViewOwnAppointments: true,
    canCancelOwnAppointments: true,
    canViewMedicalRecords: true,
    canDeleteAppointment: false,
    canDeleteUsers: false,
    canManageUsers: false,
    canAccessReports: false,
    canBanUsers: false,
    canModerateContent: false,
    premiumFeatures: true
  },
  [ROLES.DOCTOR]: {
    canViewOwnProfile: true,
    canUpdateOwnProfile: true,
    canViewAppointments: true,
    canManageAppointments: true,
    canViewPatientRecords: true,
    canCreateRecords: true,
    canDeleteAppointment: false,
    canDeleteUsers: false,
    canManageUsers: false,
    canAccessReports: false,
    canBanUsers: false,
    canModerateContent: false
  },
  [ROLES.MODERATOR]: {
    canViewOwnProfile: true,
    canUpdateOwnProfile: true,
    canViewAllUsers: true,
    canModerateContent: true,
    canBanUsers: true,
    canAccessReports: true,
    canDeleteAppointment: false,
    canDeleteUsers: false,
    canManageUsers: false
  },
  [ROLES.ADMIN]: {
    canViewOwnProfile: true,
    canUpdateOwnProfile: true,
    canDeleteAppointment: true,
    canDeleteUsers: true,
    canManageUsers: true,
    canAccessReports: true,
    canBanUsers: true,
    canModerateContent: true,
    canViewAllUsers: true,
    fullAccess: true
  }
};

// Check if user has specific role(s)
const checkRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      if (roles.includes(user.role)) {
        req.user = user;
        next();
      } else {
        res.status(403).json({ 
          message: `Require one of these roles: ${roles.join(', ')}`,
          requiredRoles: roles,
          userRole: user.role
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

// Check if user has specific permission
const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userPermissions = PERMISSIONS[user.role];
      if (!userPermissions) {
        return res.status(403).json({ message: 'User role not recognized' });
      }

      if (userPermissions[permission] || userPermissions.fullAccess) {
        req.user = user;
        req.userPermissions = userPermissions;
        next();
      } else {
        res.status(403).json({ 
          message: `User does not have permission: ${permission}`,
          requiredPermission: permission,
          userRole: user.role
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

// Check if user can perform action on own resource
const checkOwnershipOrAdmin = (resourceUserId) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Admin has access to everything
      if (user.role === ROLES.ADMIN) {
        req.user = user;
        return next();
      }

      // User can only modify their own resources
      if (user._id.toString() === resourceUserId.toString()) {
        req.user = user;
        return next();
      }

      res.status(403).json({ 
        message: 'Access denied. You can only modify your own resources',
        userRole: user.role
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = {
  checkRole,
  checkPermission,
  checkOwnershipOrAdmin,
  ROLES,
  PERMISSIONS
};