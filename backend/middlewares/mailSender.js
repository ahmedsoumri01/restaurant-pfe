const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});

// Common styling for all emails
const styles = `
  body { 
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
    background-color: #f5f7fa; 
    margin: 0; 
    padding: 0; 
    color: #333;
  }
  .container { 
    max-width: 600px; 
    margin: 20px auto; 
    background: #fff; 
    padding: 0; 
    border-radius: 8px; 
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .header { 
    background: linear-gradient(135deg, #ff7e5f, #feb47b); 
    color: white; 
    padding: 20px; 
    text-align: center; 
    font-size: 24px; 
    border-radius: 8px 8px 0 0;
  }
  .logo {
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 28px;
  }
  .content { 
    padding: 30px; 
    line-height: 1.6;
  }
  .credentials {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 15px;
    margin: 20px 0;
  }
  .copy-field {
    display: flex;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 12px;
    margin: 8px 0;
    font-family: monospace;
    position: relative;
  }
  .button {
    display: inline-block;
    background: #ff7e5f;
    color: white;
    padding: 12px 25px;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;
    margin: 15px 0;
  }
  .info-box {
    background-color: #e7f3ff;
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 20px 0;
    border-radius: 0 4px 4px 0;
  }
  .warning-box {
    background-color: #fff3cd;
    border-left: 4px solid #ffc107;
    padding: 15px;
    margin: 20px 0;
    border-radius: 0 4px 4px 0;
  }
  .success-box {
    background-color: #d4edda;
    border-left: 4px solid #28a745;
    padding: 15px;
    margin: 20px 0;
    border-radius: 0 4px 4px 0;
  }
  .danger-box {
    background-color: #f8d7da;
    border-left: 4px solid #dc3545;
    padding: 15px;
    margin: 20px 0;
    border-radius: 0 4px 4px 0;
  }
  .footer { 
    margin-top: 20px; 
    text-align: center; 
    font-size: 14px; 
    color: #6c757d; 
    padding: 20px;
    border-top: 1px solid #eee;
  }
  .social-links {
    margin: 15px 0;
  }
  .social-links a {
    display: inline-block;
    margin: 0 10px;
    color: #ff7e5f;
    text-decoration: none;
  }
`;

// Function to send welcome email to normal users
exports.sendWelcomeEmail = async (nom, prenom, email, password) => {
  const mailOptions = {
    from: process.env.NODE_MAILER_EMAIL,
    to: email,
    subject: "Bienvenue sur notre plateforme",
    html: `
      <html>
      <head>
        <style>${styles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">FoodDelivery</div>
            <div>Bienvenue sur notre plateforme</div>
          </div>
          <div class="content">
            <h2>Bonjour ${prenom} ${nom},</h2>
            <p>Nous sommes ravis de vous accueillir sur notre plateforme de livraison de repas.</p>
            
            <div class="success-box">
              <h3>Votre compte a été créé avec succès !</h3>
              <p>Vous pouvez maintenant vous connecter et commencer à explorer notre plateforme.</p>
            </div>
            
            <div class="credentials">
              <h3>Vos informations de connexion</h3>
              <p><strong>Email:</strong></p>
              <div class="copy-field">${email}</div>
              
              <p><strong>Mot de passe:</strong></p>
              <div class="copy-field">${password}</div>
              
              <p>Nous vous recommandons de changer votre mot de passe après votre première connexion.</p>
            </div>
            
            <a href="#" class="button">Se connecter maintenant</a>
            
            <div class="info-box">
              <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à contacter notre équipe de support.</p>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} FoodDelivery. Tous droits réservés.</p>
            <div class="social-links">
              <a href="#">Facebook</a> | <a href="#">Twitter</a> | <a href="#">Instagram</a>
            </div>
            <p>Cet e-mail a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de bienvenue envoyé à ${email} avec succès.`);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail de bienvenue:", error);
    return false;
  }
};

// Function to send welcome email to restaurant owners
exports.sendRestaurantOwnerWelcomeEmail = async (
  nom,
  prenom,
  email,
  password
) => {
  const mailOptions = {
    from: process.env.NODE_MAILER_EMAIL,
    to: email,
    subject: "Bienvenue parmi nos partenaires restaurateurs",
    html: `
      <html>
      <head>
        <style>${styles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">FoodDelivery</div>
            <div>Bienvenue cher partenaire restaurateur</div>
          </div>
          <div class="content">
            <h2>Bonjour ${prenom} ${nom},</h2>
            <p>Notre équipe administrative a créé un compte pour vous sur notre plateforme de livraison de repas.</p>
            
            <div class="success-box">
              <h3>Vous êtes maintenant un partenaire restaurateur !</h3>
              <p>Connectez-vous pour créer le profil de votre restaurant et commencer à recevoir des commandes.</p>
            </div>
            
            <div class="credentials">
              <h3>Vos informations de connexion</h3>
              <p><strong>Email:</strong></p>
              <div class="copy-field">${email}</div>
              
              <p><strong>Mot de passe:</strong></p>
              <div class="copy-field">${password}</div>
              
              <p><strong>Important:</strong> Veuillez conserver ces informations en lieu sûr et changer votre mot de passe après votre première connexion.</p>
            </div>
            
            <a href="#" class="button">Accéder à votre espace restaurateur</a>
            
            <div class="info-box">
              <h3>Prochaines étapes</h3>
              <ol>
                <li>Connectez-vous à votre compte</li>
                <li>Complétez le profil de votre restaurant</li>
                <li>Ajoutez votre menu et vos plats</li>
                <li>Définissez vos horaires d'ouverture</li>
                <li>Commencez à recevoir des commandes !</li>
              </ol>
            </div>
            
            <p>Notre équipe d'assistance est disponible pour vous aider à chaque étape de votre intégration.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} FoodDelivery. Tous droits réservés.</p>
            <div class="social-links">
              <a href="#">Facebook</a> | <a href="#">Twitter</a> | <a href="#">Instagram</a>
            </div>
            <p>Pour toute question, contactez notre équipe dédiée aux partenaires restaurateurs.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Email de bienvenue restaurateur envoyé à ${email} avec succès.`
    );
    return true;
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'e-mail de bienvenue restaurateur:",
      error
    );
    return false;
  }
};

// Function to notify user of account deletion
exports.sendAccountDeletionEmail = async (user) => {
  const mailOptions = {
    from: process.env.NODE_MAILER_EMAIL,
    to: user.email,
    subject: "Votre compte a été supprimé",
    html: `
      <html>
      <head>
        <style>${styles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">FoodDelivery</div>
            <div>Suppression de compte</div>
          </div>
          <div class="content">
            <h2>Bonjour ${user.prenom} ${user.nom},</h2>
            <p>Nous vous informons que votre compte sur notre plateforme a été supprimé.</p>
            
            <div class="danger-box">
              <h3>Votre compte n'est plus actif</h3>
              <p>Toutes vos données personnelles ont été supprimées de notre système conformément à notre politique de confidentialité.</p>
            </div>
            
            <p>Si cette suppression a été effectuée par erreur ou si vous n'avez pas demandé cette action, veuillez contacter notre service client immédiatement.</p>
            
            <a href="#" class="button">Contacter le support</a>
            
            <div class="info-box">
              <p>Nous sommes désolés de vous voir partir. Si vous souhaitez nous faire part de vos commentaires ou nous dire pourquoi vous avez quitté notre plateforme, n'hésitez pas à répondre à cet e-mail.</p>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} FoodDelivery. Tous droits réservés.</p>
            <p>Cet e-mail a été envoyé automatiquement pour vous informer de la suppression de votre compte.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Email de suppression de compte envoyé à ${user.email} avec succès.`
    );
    return true;
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'e-mail de suppression de compte:",
      error
    );
    return false;
  }
};

// Function to notify user of account activation
exports.sendAccountActivationEmail = async (user) => {
  const mailOptions = {
    from: process.env.NODE_MAILER_EMAIL,
    to: user.email,
    subject: "Votre compte a été activé",
    html: `
      <html>
      <head>
        <style>${styles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">FoodDelivery</div>
            <div>Activation de compte</div>
          </div>
          <div class="content">
            <h2>Bonjour ${user.prenom} ${user.nom},</h2>
            <p>Nous avons le plaisir de vous informer que votre compte sur notre plateforme a été activé avec succès.</p>
            
            <div class="success-box">
              <h3>Votre compte est maintenant actif !</h3>
              <p>Vous pouvez dès à présent vous connecter et profiter de tous les services de notre plateforme.</p>
            </div>
            
            <a href="#" class="button">Se connecter maintenant</a>
            
            ${
              user.role === "restaurant"
                ? `
            <div class="info-box">
              <h3>Démarrez avec votre restaurant</h3>
              <p>N'oubliez pas de compléter le profil de votre restaurant et d'ajouter vos menus pour commencer à recevoir des commandes.</p>
            </div>
            `
                : user.role === "livreur"
                ? `
            <div class="info-box">
              <h3>Démarrez comme livreur</h3>
              <p>N'oubliez pas de définir votre disponibilité pour commencer à recevoir des propositions de livraison.</p>
            </div>
            `
                : `
            <div class="info-box">
              <p>Découvrez notre sélection de restaurants et commencez à commander vos plats préférés.</p>
            </div>
            `
            }
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} FoodDelivery. Tous droits réservés.</p>
            <div class="social-links">
              <a href="#">Facebook</a> | <a href="#">Twitter</a> | <a href="#">Instagram</a>
            </div>
            <p>Pour toute question, n'hésitez pas à contacter notre service client.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Email d'activation de compte envoyé à ${user.email} avec succès.`
    );
    return true;
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'e-mail d'activation de compte:",
      error
    );
    return false;
  }
};

// Function to notify user of account suspension
exports.sendAccountSuspensionEmail = async (user) => {
  const mailOptions = {
    from: process.env.NODE_MAILER_EMAIL,
    to: user.email,
    subject: "Votre compte a été suspendu",
    html: `
      <html>
      <head>
        <style>${styles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">FoodDelivery</div>
            <div>Suspension de compte</div>
          </div>
          <div class="content">
            <h2>Bonjour ${user.prenom} ${user.nom},</h2>
            <p>Nous vous informons que votre compte sur notre plateforme a été temporairement suspendu.</p>
            
            <div class="warning-box">
              <h3>Votre compte est actuellement bloqué</h3>
              <p>Cette décision a été prise conformément à nos conditions d'utilisation. Votre accès à notre plateforme est temporairement restreint.</p>
            </div>
            
            <div class="info-box">
              <h3>Comment réactiver votre compte</h3>
              <p>Pour demander la réactivation de votre compte, veuillez contacter notre service client en expliquant votre situation.</p>
            </div>
            
            <a href="#" class="button">Contacter le support</a>
            
            <p>Notre équipe examinera votre demande dans les plus brefs délais et vous tiendra informé de la suite donnée à votre requête.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} FoodDelivery. Tous droits réservés.</p>
            <p>Si vous pensez que cette suspension est une erreur, veuillez nous contacter immédiatement.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Email de suspension de compte envoyé à ${user.email} avec succès.`
    );
    return true;
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'e-mail de suspension de compte:",
      error
    );
    return false;
  }
};
