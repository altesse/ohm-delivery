const shortid = require('shortid');
const cors = require('cors');
var express = require('express');
var app = express();
app.use(cors());
const bodyParser = require('body-parser');
const Utils = require('./utils');
app.use(bodyParser.json());

function serve() {
    app.get('/ohms/:id', async (req, res) => {
        const ohm = await Utils.getOhmById(req.params.id);
        res.send(ohm);
    })

    app.get('/trackedOhms/:id', async (req, res) => {
        const ohm = await Utils.getOhmByTrackingId(req.params.id);
        if (ohm != null) {
            res.send(ohm);
            return;
        }
        res.sendStatus(404); // TODO: Constantified statuses
    })

    app.get('/trackedOhms/status/:id', async (req, res) => {
        const ohmStatus = await Utils.getOhmStatusByTrackingId(req.params.id);
        if (ohmStatus != null) {
            res.send(ohmStatus);
            return;
        }
        res.sendStatus(404);
    })

    app.post('/trackedOhms/status/:id', async (req, res) => {
        const newStatus = req.body.value;
        let ohmResult;
        if (newStatus === 'REFUSED') {
            const comment = req.body.comment;
            if (!comment) {
                res.sendStatus(400);
                return;
            }
            ohmResult = await Utils.updateOhmStatusByTrackingId(req.params.id, newStatus, comment);
        } else {
            ohmResult = await Utils.updateOhmStatusByTrackingId(req.params.id, newStatus);
        }
        if (ohmResult != null && ohmResult.status === req.body.value) {
            res.sendStatus(204);
            return;
        }
        res.sendStatus(400);
    })

    app.listen(3000, () => console.log('listening on port 3000'));
}

serve();