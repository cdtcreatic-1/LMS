const { app_url, frontend_host } = require('../config/config')

const domain = app_url()
const domainFrontend = frontend_host();

const style = `  <style>
/* Estilos generales */
body {
  font-family: Lato, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1,
p {
  margin: 0;
}
/* Estilos específicos */
.header {
  background-color: #2F0084;
  color: white;
  text-align: center;
  padding: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}
.content {
  padding: 20px 0;
}
.name {
  font-weight: bold;
}
.btn {
  display: inline-block;
  margin: 15px 0;
  padding: 12px;
  border-radius: 5px;
  background-color: #2F0084;
  color: white;
  text-decoration: none;
  font-weight: bold;
}  
.btn:hover{
  cursor: pointer;
  background-color: rgb(82, 118, 185);
}
.footer {
  text-align: center;
  padding-top: 20px;
  border-top: 2px solid #ccc;
}
</style>`

const registerMail = (data) => {
  const { name, token } = data;

  const image_route = domain + "uploads/email.png";
  const frontLink = `${domainFrontend}verify_token/${token}`;

  return `
  ${style}
  
  <div class="container">
    <div class="header">
      <h1>¡Cuenta Creada Correctamente!</h1>
    </div>
    <img src="${image_route}" alt="profile_photo" style="width: 100%; max-width: 600px;" /> 
    <div class="content">
      <p>
        Hola <span class="name">${name}</span>, tu cuenta ya está lista, solo falta validarla, para hacerlo haz click en el siguiente botón:
      </p>
  
      <a href="${frontLink}" class="btn">Enlace de verificación</a>
  
      <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>
    </div>
    <div class="footer">
      <p>Gracias por utilizar nuestro servicio.</p>
    </div>
  </div>
  `}

const passwordRecovery = (token) => {

  const image_route = domain + "uploads/password.png";
  const recoveryLink = `${domainFrontend}/recovery_password/${token}`;

  return `
  ${style}
  
  <div class="container">
    <div class="header">
      <h1>¡Recupera tu Contraseña!</h1>
    </div>
    <div class="content">
    <img src="${image_route}" alt="Recuperación de contraseña" style="width: 100%; max-width: 600px;">    

      <p>
        Hola, parece que olvidaste tu contraseña, para recuperarla haz click en el siguiente botón:
      </p>

      <center>
          <a href="${recoveryLink}" class="btn">Enlace de recuperación de contraseña</a>
      </center>
  
      <p>Si tu no solicitaste la recuperación de tu contraseña, puedes ignorar este mensaje.</p>
    </div>
    <div class="footer">
      <p>Gracias por utilizar nuestro servicio.</p>
    </div>
  </div>
  `
}

module.exports = {
  registerMail,
  passwordRecovery
}