const models = require('../../models');
const { deleteFile } = require('../../utils/fileUpload');

// Sensitive system models that should never be deleted via generic deleteRecord
const RESTRICTED_MODELS = ['Admin', 'AppSetting', 'TokenBlacklist', 'RefreshToken', 'Otp'];

const deleteRecord = async (req, modelName, id, force = false) => {
    try {
        if (!modelName || !id) {
            return { success: false, message: req.__('Invalid parameters.') };
        }

        if (RESTRICTED_MODELS.includes(modelName)) {
            return { success: false, message: req.__('Deletion not allowed for this model.') };
        }

        const Model = models[modelName]; // dynamic model
        if (!Model) {
            return { success: false, message: req.__('Invalid model.') };
        }

        const record = await Model.findByPk(id);
        if (!record) {
            return { success: false, message: req.__('Record not found') };
        }

        // Collect any associated files/images to delete (checks common column names)
        const possibleFileFields = ['profile_image', 'image', 'avatar', 'file', 'attachment', 'icon', 'thumbnail'];
        const filesToDelete = [];
        for (const field of possibleFileFields) {
            if (record[field] && typeof record[field] === 'string') {
                filesToDelete.push(record[field]);
            }
        }

        // 1. Delete database record first
        await record.destroy({ force });

        // 2. Safely remove physical files only after database deletion succeeds
        for (const filePath of filesToDelete) {
            try {
                await deleteFile(filePath);
            } catch (fileErr) {
                console.error(`Error deleting file (${filePath}):`, fileErr);
            }
        }

        return { success: true, message: req.__('Record deleted successfully') };
    } catch (error) {
        console.error('Delete Record Error:', error);
        return { success: false, message: req.__('Failed to delete record') };
    }
};

module.exports = deleteRecord;