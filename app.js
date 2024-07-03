const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de sesiones
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Middleware para parsear datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar el transporte de Nodemailer
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yosoybettyc@gmail.com', // Reemplaza con tu dirección de correo Gmail
    pass: '0000 0000 0000 0000' // Reemplaza con tu contraseña de aplicación generada en Gmail
  }
});

// Función para enviar el correo electrónico
function enviarCorreo(destinatario, asunto, cuerpo) {
  let mailOptions = {
    from: 'yosoybettyc@gmail.com',
    to: destinatario,
    subject: asunto,
    html: cuerpo
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
}

// Rutas de las páginas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'products.html'));
});

app.get('/order', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'order.html'));
});

app.post('/order', (req, res) => {
  // Almacenar los datos del pedido en la sesión
  req.session.order = req.body;

  // Obtener datos del formulario
  let nombre = req.body.name;
  let email = req.body.email;
  let producto = req.body.product;
  let color = req.body.color;
  let diseño = req.body.design;
  let precio = req.body.price;

  // Crear el cuerpo del correo electrónico
  let cuerpoCorreo = `
    <h2>Resumen de Pedido</h2>
    <p>Nombre: ${nombre}</p>
    <p>Email: ${email}</p>
    <p>Producto: ${producto}</p>
    <p>Color: ${color}</p>
    <p>Diseño: ${diseño}</p>
    <p>Precio: ${precio}</p>
  `;

  // Enviar correo electrónico
  enviarCorreo(email, 'Confirmación de Pedido', cuerpoCorreo);

  // Redirigir al usuario a la página de confirmación
  res.redirect('/confirmation');
});

app.get('/confirmation', (req, res) => {
  // Mostrar la confirmación con los detalles del pedido
  res.send(`
    <html>
      <head>
        <title>Confirmación de Pedido</title>
      </head>
      <body>
        <h1>Pedido Confirmado</h1>
        <p>Detalles del pedido: ${JSON.stringify(req.session.order)}</p>
        <a href="/">Volver al inicio</a>
      </body>
    </html>
  `);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
