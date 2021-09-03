const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('db.json');
const config = require('../db.config.json');

const db = (async () => {
  const _db = await low(adapter);
  await _db.defaults(config).write();
  return _db;
})();

async function getOhmById(id) {
    return (await db).get('ohms')
        .find({ id })
        .value();
}

async function getOhmByTrackingId(trackingId) {
    return (await db).get('ohms')
        .find({ trackingId })
        .value();
}

async function getOhmStatusByTrackingId(trackingId) {
    const ohm = await getOhmByTrackingId(trackingId);
    return (ohm && { status: ohm.status, comment: ohm.comment }) || undefined;
}

async function updateOhmStatusByTrackingId(trackingId, newStatus, comment) {
    // TODO: status check before update (value and lifecycle)
    return (await db).get('ohms')
        .find({ trackingId })
        .assign(comment ? { status: newStatus, comment } : { status: newStatus })
        .write();
}

module.exports = {
    getOhmById,
    getOhmByTrackingId,
    getOhmStatusByTrackingId,
    updateOhmStatusByTrackingId,
}