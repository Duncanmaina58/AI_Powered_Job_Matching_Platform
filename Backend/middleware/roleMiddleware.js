// middleware/roleMiddleware.js

// Reusable function for multiple roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};

// ✅ Direct middleware for employers only
export const isEmployer = (req, res, next) => {
  if (!req.user || req.user.role !== "employer") {
    return res.status(403).json({ message: "Access denied: Employers only" });
  }
  next();
};
