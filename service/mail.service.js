const nodemailer = require('nodemailer');

class MailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			// service: 'gmail',
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		});
	}

	async sendResetPasswordLink(to, text = '', link = '') {
		let textCustom = text && `<h1>${text}</h1>`;
		let linkCustom = link && `<a href="${link}">${link}</a>`;
		await this.transporter.sendMail({
			from: process.env.SMTP_USERS,
			to,
			subject: 'Account activation on ' + process.env.CLIENT_URL,
			text: '',
			html: `
                    <div>
                        ${textCustom}
                        ${linkCustom}
                    </div>
                `,
		});
	}

	async sendRegistrationMail(login, password) {
		await this.transporter.sendMail(
			{
				from: process.env.SMTP_USER,
				to: login,
				subject: `Account access for ${process.env.CLIENT_URL}`,
				text: '',
				html: `
                    <div>
						<p>
							You have been registered on ${process.env.CLIENT_URL}
						</p>
						<p>
							Your account access:
						</p>
						<p>
							Login: ${login}
						</p>
						<p>
							Password: ${password}
						</p>
                    </div>
                `,
			},
			(error) => {
				if (error) return error;
			}
		);
	}

	async sendEmailToVendor(to, from, fromNickname, msg) {
		await this.transporter.sendMail({
			from,
			to,
			subject: `Message send via your Grateex profile from ${fromNickname}`,
			html: `
				<p>${msg}</p>
				<hr>
				<p>This email was sent from <${from}> thtough your profile contact form Grateex</p>
				<p>If you need to verify this user is a customer of yours, visit <a href="${process.env.CLIENT_URL}/vendor/${fromNickname}">${process.env.CLIENT_URL}/vendor/${fromNickname}</a></p>
			`,
		});
	}
}

module.exports = new MailService();
