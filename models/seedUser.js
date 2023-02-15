const mongoose = require("mongoose");
const { User } = require("./user");

// seed user
const newUser = new User({
  username: "marcus",
  password: "password",
  email: "marcus@gmail.com",
});

async function seedUser() {
  //   await User.create(newUser);
  await User.findOne({ username: "marcus" }).then((user) => {
    if (!user) User.create(newUser);
  });
}

module.exports.seedUser = seedUser;
