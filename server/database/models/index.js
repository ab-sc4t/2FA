import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadModels = async (sequelize, Sequelize) => {
    const models = {};
    const modelsDir = __dirname;

    const files = fs.readdirSync(modelsDir);

    for (const file of files) {
        if (file !== path.basename(__filename) && file.endsWith('.js')) {
            const filePath = path.join(modelsDir, file);
            const modelPath = `file://${filePath}`;
            const modelDefiner = (await import(modelPath)).default;
            const model = modelDefiner(sequelize, Sequelize.DataTypes);
            models[model.name] = model;
        }
    }

    Object.keys(models).forEach(modelName => {
        if (models[modelName].associate) {
            models[modelName].associate(models);
        }
    });

    return models;
};
