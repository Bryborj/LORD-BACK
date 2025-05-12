const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

  if (!token)
    return res
      .status(401)
      .json({ mensaje: "Acceso denegado. No se proporcionó token." });

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verificado;
    next();
  } catch (err) {
    res.status(401).json({ mensaje: "Token inválido." });
  }
}

module.exports = verificarToken;
