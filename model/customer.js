module.exports = function(sequelize, Datatypes) {
  var model = {
    license: {
      type: Datatypes.STRING,
      allowNull: false
    },
    name: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    maxUsers: {
      type: Datatypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    }
  };

  return sequelize.define('Customer', model);
};
