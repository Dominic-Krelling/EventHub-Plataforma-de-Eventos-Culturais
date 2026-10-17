const eventService = require('../event/eventService')

async function create(req, res, next) {
  try {
    const event = await eventService.createEvent({
      title: req.body.title,
      description: req.body.description,
      image: req.file?.filename,
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

    return next(error)
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
    return next(error)
  }
}

async function listMine(req, res) {
  const userId = req.user.id
  const events = await eventService.listMyEvents(userId)
 
  return res.status(200).json({
    success: true,
    message: 'Eventos do usuário listados com sucesso.',
    data: events
  })
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
    return next(error)
  }
}

async function getForEdit(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({ success: false, message: 'ID do evento inválido.', errors: [] })
    }
    const event = await eventService.findEventById(id)
    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento não encontrado.', errors: [] })
    }
    if (Number(event.userId) !== Number(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Você não tem permissão para editar este evento.', errors: [] })
    }
    return res.status(200).json({ success: true, message: 'Dados de edição carregados.', data: event })
  } catch (error) {
    return next(error)
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id)

    if (!Number.isSafeInteger(id) || id < 1) {
      if (req.file?.filename) {
        await eventService.deleteEventImage(req.file.filename)
      }

      return res.status(400).json({
        success: false,
        message: 'ID do evento inválido.',
        errors: []
      })
    }

    const event = await eventService.updateEvent(
      id,
      req.user.id,
      req.body,
      req.file?.filename
    )

    return res.status(200).json({
      success: true,
      message: 'Evento atualizado com sucesso.',
      data: event
    })
  } catch (error) {
    if (req.file?.filename) {
      await eventService.deleteEventImage(req.file.filename)
    }

    return next(error)
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id)

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: 'ID do evento inválido.',
        errors: []
      })
    }

    const result = await eventService.removeEvent(
      id,
      req.user.id
    )

    return res.status(200).json({
      success: true,
      message: 'Evento excluído com sucesso.',
      data: result
    })
  } catch (error) {
    return next(error)
  }
}

async function feed(req, res, next) {
  try {
    const page = Number(req.query.page ?? 1)
    const limit = Number(req.query.limit ?? 6)

    if (
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 50
    ) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros de paginação inválidos.',
        errors: []
      })
    }

    const result = await eventService.getFeedEvents({
      page,
      limit
    })

    return res.status(200).json({
      success: true,
      message: 'Feed carregado com sucesso.',
      data: result
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  create,
  list,
  listMine,
  findById,
  update,
  remove,
  feed,
  getForEdit
}