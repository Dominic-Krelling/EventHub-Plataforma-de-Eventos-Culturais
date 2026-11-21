const Report = require('./reportModel')
const Event = require('../event/eventModel')

function httpError(message, status) {
  const error = new Error(message)
  error.status = status
  return error
}

async function createReport({ userId, eventId, reason }) {
  const event = await Event.findByPk(eventId, { attributes: ['id', 'userId'] })

  if (!event) throw httpError('Evento não encontrado.', 404)

  if (Number(event.userId) === Number(userId)) {
    throw httpError('Você não pode denunciar o seu próprio evento.', 400)
  }

  const [report, created] = await Report.findOrCreate({
    where: { userId, eventId },
    defaults: { reason }
  })

  if (!created) throw httpError('Você já denunciou este evento.', 409)

  return { id: report.id, eventId: report.eventId, reason: report.reason }
}

module.exports = { createReport }