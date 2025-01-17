const PlantModel = require('../models/plantModel');

const PlantService = {
  async createPlant(user_id, plant_name) {
    // Validasi input
    if (!plant_name) {
      throw new Error('Nama tanaman harus diisi.');
    }

    // Simpan data tanaman ke database
    const plant = await PlantModel.createPlant(user_id, plant_name);
    return plant;
  },

  async getPlantsByUser(user_id) {
    // Ambil semua data tanaman berdasarkan user_id
    const plants = await PlantModel.getPlantsByUser(user_id);
    return plants;
  },

  async getPlantById(user_id, plant_id) {
    // Ambil data tanaman berdasarkan id dan user_id untuk validasi kepemilikan
    const plant = await PlantModel.getPlantById(user_id, plant_id);

    if (!plant) {
      throw new Error('Tanaman tidak ditemukan atau Anda tidak memiliki akses.');
    }

    return plant;
  },

  async updatePlant(user_id, plant_id, plant_name) {
    // Validasi input
    if (!plant_name) {
      throw new Error('Nama tanaman harus diisi.');
    }

    // Perbarui data tanaman
    const updatedPlant = await PlantModel.updatePlant(user_id, plant_id, plant_name);

    if (!updatedPlant) {
      throw new Error('Gagal memperbarui tanaman.');
    }

    return updatedPlant;
  },

  async deletePlant(user_id, plant_id) {
    // Hapus data tanaman berdasarkan id dan user_id
    const deleted = await PlantModel.deletePlant(user_id, plant_id);

    if (!deleted) {
      throw new Error('Gagal menghapus tanaman.');
    }

    return deleted;
  },
};

module.exports = PlantService;
