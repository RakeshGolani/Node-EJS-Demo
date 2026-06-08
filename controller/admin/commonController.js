const utilsChangeStatus = require('../../utils/admin/changeStatus');
const utilsDeleteRecord = require('../../utils/admin/deleteRecord');

class commonController 
{
    static async changeStatus(req, res) 
    {
        const { id,model } = req.query;

        const result = await utilsChangeStatus(req, model, id, 'status');
        res.json(result);
    }

    static async deleteRecord(req, res)
    {
        const { id,model } = req.query;

        const result = await utilsDeleteRecord(req, model, id);
        res.json(result);
    }
}

module.exports = commonController;