const router = require('express').Router();
const Event = require('../models/Event');
const eventsController = require('../controllers/EventsController');

const validateEventId = async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }
    next();
}

router.get('/events', eventsController.index);

router.get('/events/:eventId', validateEventId, eventsController.show);

router.post('/events', eventsController.create);

router.put('/events/:eventId', validateEventId, eventsController.update);

router.delete('/events/:eventId', validateEventId, eventsController.delete);

module.exports = router;