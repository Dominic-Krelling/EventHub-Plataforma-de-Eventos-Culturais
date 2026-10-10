const eventService = require('./eventService')

async function create(req, res, next) {
  try {
    const event = await eventService.createEvent({
      title: req.body.title,
      description: req.body.description,
      image: req.file.filename,
      userId: req.user.id
    })

    return res.status(201).json({
      success: true,
      message: 'Evento publicado com sucesso!',
      data: event
    })
  } catch (error) {
    await eventService.deleteUploadedImage(req.file?.filename)
    next(error)
  }
}

async function list(req, res) {
  const events = await eventService.getAllEvents()

  return res.status(200).json({
    success: true,
    message: 'Eventos encontrados.',
    data: events
  })
}

async function findById(req, res) {
  const event = await eventService.getEventById(req.params.id)

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Evento não encontrado.',
      errors: []
    })
  }

  return res.status(200).json({
    success: true,
    message: 'Evento encontrado.',
    data: event
  })
}

module.exports = {
  create,
  list,
  findById
}
