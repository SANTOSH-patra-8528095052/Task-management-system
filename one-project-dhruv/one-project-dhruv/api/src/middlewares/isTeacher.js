export const requireTeacher = (req, res, next) => {
  console.log("started");
  
  if (req.user && req.user.role === "teacher") {
    console.log("requireTeacher - user role:", req.user?.role);
    next();
  } else {
    res.status(403).json({ message: "Only teachers can perform this action." });
  }
};
  