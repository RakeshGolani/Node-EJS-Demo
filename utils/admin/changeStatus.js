const models = require('../../models');
const changeStatus = async (req, modelName, id, statusField = 'status') => {
    try {
        
        const Model = models[modelName]; // dynamic model
        if (!Model) return { success: false, message: req.__('Invalid model.') };

        const record = await Model.findByPk(id);
        if (!record) {
        return { success: false, message: req.__('Record not found') };
        }

        record[statusField] = record[statusField] === 'active' ? 'inactive' : 'active';
        await record.save();

        return { success: true, message: req.__('Status updated successfully') };
    } catch (error) {
        //console.error('Change Status Error:', error);
        return { success: false, message: req.__('Failed to update status') };
    }
};

module.exports = changeStatus;