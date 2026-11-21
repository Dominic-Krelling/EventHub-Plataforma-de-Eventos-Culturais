const reportService = require('./reportService')
const { parseId } = require('../../utils/parseId')

async function create(req, res) {
  const eventId = parseId(req.params.eventId, 'evento')

  const data = await reportService.createReport({
    userId: req.user.id,
    eventId,
    reason: req.body.reason
  })

  return res.status(201).json({ success: true, message: 'Denúncia enviada. Obrigado por avisar.', data })
}

module.exports = { create }