const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join('C:', 'Users', 'laucj', 'Downloads', 'AuthKey_Z8Z2977NGV.p8'), 'utf8');

const token = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d',
  audience: 'https://appleid.apple.com',
  issuer: '753DQ6VK9C',
  subject: 'com.ballknowledge.bk.web',
  header: {
    alg: 'ES256',
    kid: 'Z8Z2977NGV'
  }
});

console.log('\n=== APPLE SIGN IN JWT SECRET ===\n');
console.log(token);
console.log('\n=== Copy the token above and paste it into Supabase ===\n');
