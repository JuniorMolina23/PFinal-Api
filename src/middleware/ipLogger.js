const fs = require('fs');

function ipLogger(req, res, next) {
  const clientIp = req.ip;
  console.log(`Request from IP: ${clientIp}`);
  
  // Cargar el archivo JSON existente (si existe)
  let ipData = [];
  if (fs.existsSync('ipData.json')) {
    const jsonData = fs.readFileSync('ipData.json');
    ipData = JSON.parse(jsonData);
  }
  
  // Agregar la dirección IP al arreglo
  ipData.push(clientIp);
  
  // Guardar el arreglo actualizado en el archivo JSON
  fs.writeFileSync('ipData.json', JSON.stringify(ipData));
  
  next();
}

module.exports = ipLogger;
