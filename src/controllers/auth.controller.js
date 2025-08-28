const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role, Customer } = require('../models');
require('dotenv').config();

const roleNames = { SUPER_ADMIN: 'SUPER_ADMIN', CUSTOMER: 'CUSTOMER' };

exports.register = async (req, res) => {
  try {
    const { email, password, role = roleNames.CUSTOMER, customerId = null } = req.body;

    const roleRow = await Role.findOne({ where: { name: role } });
    if (!roleRow) return res.status(400).json({ message: 'Invalid role' });

    if (customerId) {
      const exists = await Customer.findByPk(customerId);
      if (!exists) return res.status(400).json({ message: 'Invalid customerId' });
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password_hash: hash,
      role_id: roleRow.id,
      customer_id: customerId
    });

    res.status(201).json({ id: user.id, email: user.email, role });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email }, include: [Role, Customer] });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = {
      id: user.id,
      role: user.Role.name,
      customerId: user.customer_id || null
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, user: payload });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
