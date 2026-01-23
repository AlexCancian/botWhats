import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envia um e-mail genérico usando Resend
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const from = process.env.EMAIL_FROM || "onboarding@resend.dev";

        if (!process.env.RESEND_API_KEY) {
            console.error("ERRO: RESEND_API_KEY não definido no .env");
            return { success: false, error: "Missing API Key" };
        }

        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Erro ao enviar email via Resend:', error);
            return { success: false, error };
        }

        console.log(`Email enviado com sucesso para ${to}. ID: ${data?.id}`);
        return { success: true, data };
    } catch (error) {
        console.error('Erro inesperado ao enviar email:', error);
        return { success: false, error };
    }
};

/**
 * Envia notificação de desconexão do WhatsApp
 */
export const sendDisconnectEmail = async (reason?: string) => {
    const emailTo = process.env.EMAIL_TO;
    if (!emailTo) {
        console.error("ERRO: EMAIL_TO não definido no .env");
        return;
    }

    const subject = '⚠️ Bot WhatsApp Desconectado';
    const reasonHtml = reason ? `<p style="margin: 5px 0 0 0;"><strong>Motivo:</strong> ${reason}</p>` : '';
    
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #d32f2f; margin: 0;">⚠️ Alerta de Conexão</h1>
            </div>
            <div style="color: #333; line-height: 1.6;">
                <p>Olá,</p>
                <p>O <strong>Bot WhatsApp</strong> foi desconectado e requer sua atenção.</p>
                <div style="background-color: #fff3f3; border-left: 4px solid #d32f2f; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Status:</strong> Desconectado</p>
                    <p style="margin: 5px 0 0 0;"><strong>Data:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
                    ${reasonHtml}
                </div>
                <p>Por favor, verifique o servidor ou realize o pareamento novamente se necessário.</p>
            </div>
            <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; font-size: 12px; color: #888; text-align: center;">
                <p>Enviado automaticamente pelo sistema BootWhats</p>
            </div>
        </div>
    `;

    return sendEmail(emailTo, subject, html);
};

/**
 * Envia o código de pareamento do WhatsApp
 */
export const sendPairingCodeEmail = async (code: string) => {
    const emailTo = process.env.EMAIL_TO;
    if (!emailTo) {
        console.error("ERRO: EMAIL_TO não definido no .env");
        return;
    }

    const subject = '🔑 Seu Código de Pareamento WhatsApp';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #2e7d32; margin: 0;">🔑 Código de Pareamento</h1>
            </div>
            <div style="color: #333; line-height: 1.6; text-align: center;">
                <p>Olá,</p>
                <p>Aqui está o seu código de pareamento para conectar o Bot ao WhatsApp:</p>
                <div style="background-color: #f1f8e9; border: 2px dashed #2e7d32; padding: 20px; margin: 20px 0; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1b5e20;">
                    ${code}
                </div>
                <p>Insira este código no seu celular após selecionar "Conectar com código" no WhatsApp.</p>
            </div>
            <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; font-size: 12px; color: #888; text-align: center;">
                <p>Enviado automaticamente pelo sistema BootWhats</p>
            </div>
        </div>
    `;

    return sendEmail(emailTo, subject, html);
};
