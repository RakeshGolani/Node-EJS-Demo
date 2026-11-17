const utilsChangeStatus = require('../../utils/admin/changeStatus');
const utilsDeleteRecord = require('../../utils/admin/deleteRecord');

class commonController 
{
    static async changeStatus(req, res) 
    {
        const id = req.query.id || req.body.id;
        const model = req.query.model || req.body.model;

        const result = await utilsChangeStatus(req, model, id, 'status');
        res.json(result);
    }

    static async deleteRecord(req, res)
    {
        const id = req.query.id || req.body.id;
        const model = req.query.model || req.body.model;

        const result = await utilsDeleteRecord(req, model, id);
        res.json(result);
    }
}

module.exports = commonController;