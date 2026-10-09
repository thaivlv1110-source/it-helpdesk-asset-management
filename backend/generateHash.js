const bcrypt = require("bcrypt");

bcrypt.hash("support123", 10).then((hash) => {
  console.log(hash);
});