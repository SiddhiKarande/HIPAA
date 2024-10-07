import nodemailer from 'nodemailer';
export const sendMail = async({ to, subject, text, html }: { [key: string]: string }) => {
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            },
        });
        await transporter.sendMail({
            from: `Hippa Portal<${process.env.SMTP_SENDER}>`,
            to,
            subject,
            text,
            html
        });
    }catch(e){
        console.log(e);
    }
}