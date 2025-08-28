const bcrypt = require('bcrypt');
const { Role, User } = require('../models');

module.exports = async function seed() {
  const [sa] = await Role.findOrCreate({ where: { name: 'SUPER_ADMIN' }, defaults: { name: 'SUPER_ADMIN' }});
  await Role.findOrCreate({ where: { name: 'CUSTOMER' }, defaults: { name: 'CUSTOMER' }});

  const email = 'admin@root.local';
  const existing = await User.findOne({ where: { email } });
  if (!existing) {
    const hash = await bcrypt.hash('Admin@123', 12);
    await User.create({ email, password_hash: hash, role_id: sa.id, customer_id: null });
    console.log('Seeded SUPER_ADMIN:', email, '/ password: Admin@123');
  }
};
