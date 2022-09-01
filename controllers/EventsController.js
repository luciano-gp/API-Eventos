const { Op } = require('sequelize');
const Event = require('../models/Event');

class EventsController {

    index = async (req, res, next) => {
        const params = req.query;
        const limit = params.limit || 10;
        const page = params.page || 1;
        const offset = (page - 1) * limit;
        const sort = params.sort || 'id';
        const order = params.order || 'ASC';
        const where = {};

        if (params.name) {
            where.name = {
                [Op.iLike]: `%${params.name}%`
            }
        }

        if (params.startAt) {
            where.startAt = {
                [Op.between]: [params.startAt, params.endAt]
            }
        }

        if (params.modality) {
            where.modality = {
                [Op.iLike]: `%${params.modality}%`
            }
        }

        if (params.place) {
            where.place = {
                [Op.iLike]: `%${params.place}%`
            }
        }

        if (params.min_ticketPrice) {
            where.ticketPrice = {
                [Op.gte]: params.min_ticketPrice
            }
        }

        if (params.max_ticketPrice) {
            if (!where.ticketPrice) {
                where.ticketPrice = {};
            }
            where.ticketPrice[Op.lte] = params.max_ticketPrice;
        }

        const events = await Event.findAll({
            where: where,
            limit: limit,
            offset: offset,
            order: [[sort, order]]
        });
        res.json(events);
    }

    create = async (req, res, next) => {
        try {
            const data = await this._validateData(req.body);
            const event = await Event.create(data);
            res.json(event);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    show = async (req, res, next) => {
        const event = await Event.findByPk(req.params.eventId);
        res.json(event);
    }

    update = async (req, res, next) => {
        try {
            const id = req.params.eventId;
            const data = await this._validateData(req.body, id);
            await Event.update(data, {
                where: {
                    id: id
                }
            });
            res.json(await Event.findByPk(id));
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    delete = async (req, res, next) => {
        await Event.destroy({
            where: {
                id: req.params.eventId
            }
        });
        res.json({});
    }

    _validateData = async (data, id) => {
        console.log(data.startAt)

        const attributesNotNull = ['title', 'startAt', 'endAt', 'modality'];
        const attributesAllowNull = ['description', 'place', 'ticketPrice', 'minParticipants', 'maxParticipants'];
        const event = {};
        for (const attribute of attributesNotNull) {
            if (!data[attribute]) {
                throw new Error(`The attribute "${attribute}" is required.`);
            }
            event[attribute] = data[attribute];
        }
        for (const attribute of attributesAllowNull) {
            event[attribute] = data[attribute];
        }
        if (await this._checkIfEventExists(event.title, id)) {
            throw new Error(`The event "${event.title}" already exists.`);
        }
        if (await this._checkIfHoliday(event.startAt)) {
            event.holiday = true;
        } else {
            event.holiday = false;
        }
        return event;
    }

    _checkIfEventExists = async (title, id) => {
        const where = {
            title: title
        }
        if (id) {
            where.id = { [Op.ne]: id };
        }
        const count = await Event.count({
            where: where
        })
        return count > 0;
    }

    _checkIfHoliday = async (date) => {
        date = date.split(':');
        date = date[0];
        let isHoliday = false
        const year = new Date(date).getFullYear();
        const axios = require('axios');
        const response = await axios.get(`https://brasilapi.com.br/api/feriados/v1/${year}`);
        response.data.forEach((holiday) => {
            if (holiday.date == date) isHoliday = true;
        });
        return isHoliday;
    };
}

module.exports = new EventsController();