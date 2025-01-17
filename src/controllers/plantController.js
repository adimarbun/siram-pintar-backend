const PlantService = require('../services/plantService');
const responseHelper = require('../helpers/responseHelper');

const PlantController = {
  async createPlant(req, res) {
    try {
      const { plant_name } = req.body;
      const user_id = req.user.id;

      const plant = await PlantService.createPlant(user_id, plant_name);

      responseHelper.success(res, 'Data tanaman berhasil dibuat.', plant, 201);
    } catch (error) {
      responseHelper.error(res, error.message, 400);
    }
  },

  async getPlants(req, res) {
    try {
      const user_id = req.user.id;

      const plants = await PlantService.getPlantsByUser(user_id);

      responseHelper.success(res, 'Data tanaman berhasil diambil.', plants);
    } catch (error) {
      responseHelper.error(res, error.message, 500);
    }
  },

  async getPlantById(req, res) {
    try {
      const user_id = req.user.id;
      const { id: plant_id } = req.params;

      const plant = await PlantService.getPlantById(user_id, plant_id);

      responseHelper.success(res, 'Detail tanaman berhasil diambil.', plant);
    } catch (error) {
      responseHelper.error(res, error.message, 404);
    }
  },

  async updatePlant(req, res) {
    try {
      const user_id = req.user.id;
      const { id: plant_id } = req.params;
      const { plant_name } = req.body;

      const updatedPlant = await PlantService.updatePlant(user_id, plant_id, plant_name);

      responseHelper.success(res, 'Data tanaman berhasil diperbarui.', updatedPlant);
    } catch (error) {
      responseHelper.error(res, error.message, 400);
    }
  },

  async deletePlant(req, res) {
    try {
      const user_id = req.user.id;
      const { id: plant_id } = req.params;

      await PlantService.deletePlant(user_id, plant_id);

      responseHelper.success(res, 'Data tanaman berhasil dihapus.');
    } catch (error) {
      responseHelper.error(res, error.message, 400);
    }
  },
};

module.exports = PlantController;
