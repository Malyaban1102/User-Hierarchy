const express = require('express');
const cors = require('cors');
const { sequelize, Role } = require('./models');
const seed = require('./seed/seed-superadmin');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/customers', require('./routes/customer.routes'));


const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // for production use migrations
    // Ensure roles exist & seed super admin
    await Role.findOrCreate({ where: { name: 'SUPER_ADMIN' }});
    await Role.findOrCreate({ where: { name: 'CUSTOMER' }});
    await seed();

    app.listen(PORT, () => console.log(`API running on :${PORT}`));
  } catch (e) {
    console.error('Startup error:', e);
    process.exit(1);
  }
})();
