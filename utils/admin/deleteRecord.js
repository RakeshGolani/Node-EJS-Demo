const models = require('../../models');
const { deleteFile } = require('../../utils/fileUpload');
const deleteRecord = async (req, modelName, id, force = false) => {
    try {
        const Model = models[modelName]; // dynamic model
        if (!Model) return { success: false, message: req.__('Invalid model.') };

        const record = await Model.findByPk(id);
        //console.log(record)
        if (!record) {
        return { success: false, message: req.__('Record not found') };
        }

        deleteFile(record['profile_image']);
        
        await record.destroy({ force }); // force: true for hard delete
        return { success: true, message: req.__('Record deleted successfully') };
    } catch (error) {
        console.error('Delete Record Error:', error);
        return { success: false, message: req.__('Failed to delete record') };
    }
};

module.exports = deleteRecord;