const AuthService = require('../services/authService');

const AuthController = {
  async register(req, res) {
    try {
      const { email, name, password } = req.body;
      const user = await AuthService.register(email, name, password);
      res.status(201).json({ message: 'Registrasi berhasil.', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);
      res.status(200).json({ message: 'Login berhasil.', token, user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = AuthController;
