const {DataTypes, Model} = require('sequelize');
const db = require('../db');

class Event extends Model {};

Event.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    startAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    modality: {
      type: DataTypes.STRING,
      allowNull: false
    },
    place: {
      type: DataTypes.STRING
    },
    ticketPrice: {
      type: DataTypes.FLOAT,
    },
    minParticipants: {
      type: DataTypes.INTEGER
    },
    maxParticipants: {
      type: DataTypes.INTEGER
    },
    holiday: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize: db,
    tableName: 'Events',
    modelName: 'Events'
  });

  module.exports = Event;