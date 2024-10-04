const { transporter } = require('../configs/nodemailer.configs');
const sendMail = (mailOptions) => {
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
            return false;
        }
        return true;
    });
    return true;
};
module.exports = {
    sendMail,
};
