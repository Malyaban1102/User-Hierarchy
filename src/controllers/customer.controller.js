const { Customer } = require('../models');

// Create customer (SUPER_ADMIN only)
exports.create = async (req, res) => {
  const { name, parentId = null } = req.body;
  const created = await Customer.create({ name, parent_id: parentId || null });
  res.status(201).json(created);
};

// List all customers (any authenticated; CUSTOMER read-only enforced elsewhere)
exports.list = async (_req, res) => {
  const all = await Customer.findAll();
  res.json(all);
};

// Get subtree for a node (utility: iterative)
exports.subtree = async (req, res) => {
  const rootId = parseInt(req.params.id, 10);
  const all = await Customer.findAll();
  const map = new Map(all.map(c => [c.id, { ...c.dataValues, children: [] }]));
  for (const c of map.values()) {
    if (c.parent_id && map.has(c.parent_id)) map.get(c.parent_id).children.push(c);
  }
  if (!map.has(rootId)) return res.status(404).json({ message: 'Not found' });
  res.json(map.get(rootId));
};

exports.getById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update customer (SUPER_ADMIN only)
exports.update = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const { name, parentId } = req.body;
    if (name) customer.name = name;
    if (parentId !== undefined) customer.parent_id = parentId;

    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete customer (SUPER_ADMIN only)
exports.remove = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    await customer.destroy();
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};