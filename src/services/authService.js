const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const AuthService = {
  async register(email, name, password) {
    // Periksa apakah email sudah digunakan
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('Email sudah terdaftar.');
    }

    // Enkripsi password
    const saltRounds = 10;
    const passwordEncrypt = await bcrypt.hash(password, saltRounds);

    // Simpan user ke database
    const user = await UserModel.createUser(email, name, passwordEncrypt);
    return user;
  },

  async login(email, password) {
    console.log("cekkkk",process.env.JWT_SECRET)
    // Cari user berdasarkan email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Email atau password salah.');
    }

    // Bandingkan password
    const isPasswordValid = await bcrypt.compare(password, user.password_encrypt);
    if (!isPasswordValid) {
      throw new Error('Email atau password salah.');
    }

    // Buat token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token berlaku selama 1 jam
    });

    return { token, user: { id: user.id, email: user.email, name: user.name } };
  },

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Token tidak valid.');
    }
  },
};

module.exports = AuthService;
