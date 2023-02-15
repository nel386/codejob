const crypto = require("node:crypto");

const secret = "nel386";

const hash = crypto
  .createHmac("sha256", secret)
  .update("This is the way")
  .digest("hex");

const newSecret = "Project Calendar";

const newHash = crypto
  .createHmac("sha256", newSecret)
  .update("This isn't the way")
  .digest("hex");

// console.log(hash);
console.log(newHash);
