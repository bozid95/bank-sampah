// middleware/checkAdmin.js
const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Lanjutkan ke middleware berikutnya atau rute
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

export default checkAdmin;
