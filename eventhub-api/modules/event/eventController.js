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
    if (req.file?.filename) {
      await eventService.deleteEventImage(req.file.filename)
    }

    next(error)
  }
}

async function list(req, res, next) {
  try {
    const events = await eventService.listEvents()

    return res.status(200).json({
      success: true,
      message: 'Eventos encontrados.',
      data: events
    })
  } catch (error) {
    next(error)
  }
}

async function findById(req, res, next) {
  try {
    const id = Number(req.params.id)

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: 'ID do evento inválido.',
        errors: []
      })
    }

    const event = await eventService.getEventDetails(
      id,
      req.user?.id
    )

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado.',
        errors: []
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Detalhes do evento encontrados.',
      data: event
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  create,
  list,
  findById
}
