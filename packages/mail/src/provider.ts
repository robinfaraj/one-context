import nodemailer from "nodemailer";

interface SendMailOptions {
	to: string;
	from?: string;
	subject: string;
	text?: string;
	html?: string;
}

const getTransporter = () => {
	return nodemailer.createTransport({
		host: process.env.MAIL_HOST as string,
		port: Number.parseInt(process.env.MAIL_PORT as string, 10),
		auth: {
			user: process.env.MAIL_USER as string,
			pass: process.env.MAIL_PASS as string,
		},
	});
};

export const sendMail = async ({
	to,
	from,
	subject,
	text,
	html,
}: SendMailOptions) => {
	const transporter = getTransporter();

	await transporter.sendMail({
		to,
		from,
		subject,
		text,
		html,
	});
};
