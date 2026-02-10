/**
 * RBAC (Role-Based Access Control) Usage Examples
 * This file demonstrates how to use the enhanced role middleware
 */

const express = require('express');
const { checkRole, checkPermission, checkOwnershipOrAdmin, ROLES, PERMISSIONS } = require('../middlewares/roleMiddleware');
const auth = require('../middlewares/authJwt'); // Assuming you have auth middleware

const router = express.Router();

// ============================================
// EXAMPLE 1: Basic Role Check
// ============================================

/**
 * Only ADMIN can delete users
 * Rejects patients, doctors, moderators
 */
router.delete('/users/:id', auth, checkRole(ROLES.ADMIN), async (req, res) => {
  try {
    // Delete user logic
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EXAMPLE 2: Multiple Roles Allowed
// ============================================

/**
 * DOCTOR and ADMIN can manage appointments
 * Others get 403 Forbidden
 */
router.get('/appointments/manage', auth, checkRole(ROLES.DOCTOR, ROLES.ADMIN), async (req, res) => {
  try {
    // Get appointments for management
    res.json({ message: 'Appointment management interface' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EXAMPLE 3: Permission-Based Check
// ============================================

/**
 * Check specific permission instead of role
 * Useful when role hierarchy changes
 */
router.get('/medical-records', auth, checkPermission('canViewMedicalRecords'), async (req, res) => {
  try {
    // Only premium_patient and doctor can access
    res.json({ message: 'Medical records (premium feature)' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Only admins can delete users - permission check version
 */
router.delete('/users/:id', auth, checkPermission('canDeleteUsers'), async (req, res) => {
  try {
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EXAMPLE 4: Ownership Check
// ============================================

/**
 * Users can only update their own profile
 * Admins can update anyone's profile
 */
router.put('/users/:id', auth, async (req, res) => {
  try {
    const resourceUserId = req.params.id;
    
    // Apply ownership check middleware dynamically
    const ownershipCheck = checkOwnershipOrAdmin(resourceUserId);
    
    // Call the middleware
    ownershipCheck(req, res, async () => {
      // Update user logic
      res.json({ message: 'Profile updated' });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EXAMPLE 5: Complex Permission Logic
// ============================================

/**
 * Custom middleware combining multiple checks
 */
const canModerateContent = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Check multiple conditions
    if (user.role === ROLES.ADMIN) {
      // Admins have full access
      return next();
    }
    
    if (user.role === ROLES.MODERATOR && PERMISSIONS[ROLES.MODERATOR].canModerateContent) {
      // Moderators with permission
      return next();
    }
    
    // Deny access
    res.status(403).json({ 
      message: 'You do not have permission to moderate content',
      requiredRole: [ROLES.ADMIN, ROLES.MODERATOR],
      userRole: user.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Usage of custom middleware
 */
router.post('/content/moderate', auth, canModerateContent, async (req, res) => {
  try {
    res.json({ message: 'Content moderated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EXAMPLE 6: Feature Access Based on Role
// ============================================

/**
 * Premium features - only premium_patient and above
 */
router.post('/appointments/priority-booking', auth, async (req, res) => {
  try {
    const user = req.user;
    
    // Check if user has premium access
    const premiumRoles = [ROLES.PREMIUM_PATIENT, ROLES.DOCTOR, ROLES.ADMIN];
    
    if (!premiumRoles.includes(user.role)) {
      return res.status(403).json({
        message: 'This feature is available for premium members only',
        currentRole: user.role,
        upgradeUrl: '/api/subscription/upgrade'
      });
    }
    
    // Process priority booking
    res.json({ message: 'Priority appointment booked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EXAMPLE 7: Admin Panel Access
// ============================================

/**
 * Only admins can access admin panel
 * Shows all system statistics
 */
router.get('/admin/dashboard', auth, checkRole(ROLES.ADMIN), async (req, res) => {
  try {
    const adminStats = {
      totalUsers: 150,
      totalAppointments: 342,
      totalRevenue: 45000,
      recentActivity: []
    };
    
    res.json(adminStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Manage user roles - admin only
 */
router.patch('/admin/users/:id/role', auth, checkRole(ROLES.ADMIN), async (req, res) => {
  try {
    const { newRole } = req.body;
    
    // Validate role
    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({
        message: 'Invalid role',
        validRoles: validRoles
      });
    }
    
    // Update user role in database
    // await User.findByIdAndUpdate(req.params.id, { role: newRole });
    
    res.json({ message: `User role updated to ${newRole}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EXAMPLE 8: Doctor-Specific Routes
// ============================================

/**
 * Only doctors and admins can view patient records
 */
router.get('/patients/:patientId/records', auth, checkRole(ROLES.DOCTOR, ROLES.ADMIN), async (req, res) => {
  try {
    const patientId = req.params.patientId;
    // Fetch patient records
    res.json({ message: `Records for patient ${patientId}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Only doctors can create medical records
 */
router.post('/patients/:patientId/records', auth, checkRole(ROLES.DOCTOR, ROLES.ADMIN), async (req, res) => {
  try {
    const { diagnosis, prescription, notes } = req.body;
    // Create medical record
    res.json({ message: 'Medical record created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EXAMPLE 9: User Account Operations
// ============================================

/**
 * Users can only view/update their own profile
 * Admins can view/update anyone's profile
 */
router.get('/profile/:userId', auth, async (req, res) => {
  try {
    const user = req.user;
    const targetUserId = req.params.userId;
    
    // Check ownership or admin status
    if (user._id.toString() !== targetUserId && user.role !== ROLES.ADMIN) {
      return res.status(403).json({
        message: 'You can only view your own profile',
        userRole: user.role
      });
    }
    
    // Fetch and return profile
    res.json({ message: `Profile for user ${targetUserId}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Users can delete their own account
 * Admins can delete any account
 */
router.delete('/profile/:userId', auth, async (req, res) => {
  try {
    const user = req.user;
    const targetUserId = req.params.userId;
    
    if (user._id.toString() !== targetUserId && user.role !== ROLES.ADMIN) {
      return res.status(403).json({
        message: 'You can only delete your own account',
        userRole: user.role
      });
    }
    
    // Delete account
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EXAMPLE 10: Permission Matrix Reference
// ============================================

/**
 * GET /rbac/permissions
 * Returns the complete permission matrix (optional endpoint)
 */
router.get('/rbac/permissions', auth, (req, res) => {
  res.json({
    message: 'Complete RBAC Permission Matrix',
    roles: ROLES,
    permissions: PERMISSIONS,
    description: 'Use this to understand what each role can do'
  });
});

// ============================================
// EXAMPLE 11: Error Handling
// ============================================

/**
 * Centralized error handler for RBAC errors
 */
const handleRBACError = (err, req, res, next) => {
  if (err.status === 403) {
    return res.status(403).json({
      message: 'Access Denied',
      reason: err.message,
      userRole: req.user?.role,
      requiredRoles: err.requiredRoles
    });
  }
  
  if (err.status === 404) {
    return res.status(404).json({
      message: 'User not found'
    });
  }
  
  next(err);
};

module.exports = {
  router,
  handleRBACError,
  // Export for testing or other uses
  ROLES,
  PERMISSIONS
};

/**
 * ============================================
 * INTEGRATION GUIDE
 * ============================================
 * 
 * 1. Import the router in your main app.js/server.js:
 *    const rbacExamples = require('./routes/rbac-examples');
 *    app.use('/api', rbacExamples.router);
 * 
 * 2. Basic usage patterns:
 * 
 *    // For role-based access
 *    router.delete('/admin/users/:id', auth, checkRole(ROLES.ADMIN), handler);
 * 
 *    // For permission-based access
 *    router.get('/records', auth, checkPermission('canViewMedicalRecords'), handler);
 * 
 *    // For ownership verification
 *    router.put('/profile/:id', auth, checkOwnershipOrAdmin(req.params.id), handler);
 * 
 * 3. Access user info in handlers:
 *    - req.user = authenticated user object
 *    - req.userPermissions = permissions for the role (if using checkPermission)
 * 
 * ============================================
 */
