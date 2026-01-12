import nodemailer from 'nodemailer';

const port = Number(process.env.PORT_EMAIL);
const transporter = nodemailer.createTransport({
     host: process.env.HOST_EMAIL,
      port: port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL,
        pass: process.env.SENHA_EMAIL,
      },
      tls: {
        rejectUnauthorized: false
      }
});

export const sendDisconnectEmail = async () => {
    try {
        const emailTo = process.env.EMAIL_TO;

        if (!emailTo) {
            console.error("EMAIL_TO não definido no .env");
            return;
        }

        const mailOptions = {
            from: "Equipe BootWhats <noreply@bootwhats.com.br>",
            to: emailTo,
            subject: '⚠️ Bot WhatsApp Desconectado',
            html: `
                <h3>O Bot do WhatsApp foi desconectado</h3>
                <p>O sistema detectou que a conexão com o WhatsApp foi encerrada.</p>
                <p>Verifique o terminal do servidor para logs detalhados ou tente reiniciar o serviço.</p>
                <p>Data: ${new Date().toLocaleString('pt-BR')}</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email de desconexão enviado: ' + info.response);
    } catch (error) {
        console.error('Erro ao enviar email de desconexão:', error);
    }
};
