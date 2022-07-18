const roleCheck = (roles) => {
    return (req, res, next) => {
        roles.push("user");
        if (req.user.roles.includes(...roles)) {
            next();
        } else {
            res.status(403).json({ error: true, message: "You are not authorised" });
        }
    }
}
const patientCheck = () => {
    
    return (req, res, next) => {
        if (req.body.booked_by == req.user._id) {
            next();
        } else {
            res.status(403).json({ error: true, message: "You are not authorised" });
        }
    }
}
const doctorCheck = () => {
    return (req, res, next) => {
        if (req.body.doctor_id == req.user.id) {
            next();
        } else {
            res.status(403).json({ error: true, message: "You are not authorised" });
        }
    }
}

module.exports = { roleCheck, patientCheck, doctorCheck };