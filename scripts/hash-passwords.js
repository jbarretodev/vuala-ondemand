const bcrypt = require('bcryptjs');

async function hashPasswords() {
  const password = 'password';
  const hash = await bcrypt.hash(password, 12);
  console.log(`Hashed password for 'password': ${hash}`);
}

hashPasswords();
