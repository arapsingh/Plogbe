const configs = require(".");
const bcrpyt = require("bcryptjs");
const seed = async () => {
    const hashedPassword = await bcrpyt.hash("2011069020110701", configs.general.HASH_SALT);
    const createAdmin = await configs.db.user.create({
        data: {
            first_name: "UTEMY",
            last_name: "ADMIN",
            email: "utemyvietnam@gmail.com",
            is_verify: true,
            is_admin: true,
            password: hashedPassword,
        },
    });
    console.log(createAdmin);
};

seed()
    .then(async () => {
        await configs.db.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await configs.db.$disconnect();
        process.exit(1);
    });
