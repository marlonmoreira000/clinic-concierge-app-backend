const { StatusCodes } = require("http-status-codes");
const UserModel = require("../models/userModel");

const findAll = (dbModel, query, res, sortBy = {}) => {
  
  
  dbModel
    .find(query)
    .sort(sortBy)
    .exec((err, docs) => {
      if (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: `Failed to get ${dbModel.modelName}s`,
        });
      }
      res.status(StatusCodes.OK).json(docs);
    });
};

const findById = (dbModel, id, res) => {
  dbModel.findById(id, (err, doc) => {
    if (err || !doc) {
      
      return res.status(StatusCodes.NOT_FOUND).json({
        error: true,
        message: `Failed to get ${dbModel.modelName} with id: ${id}`,
      });
    }
    res.status(StatusCodes.OK).json(doc);
  });
};

const create = (dbModel, query, model, res, role, user) => {
  
  dbModel
    .findOne(query)
    .then((existingDoc) => {
      if (existingDoc) {
        
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: true,
          message: `${dbModel.modelName} already exist, cannot recreate it`,
        });
      }

      dbModel
        .create(model)
        .then(async (doc) => {

          // Should role be added to user?
          if (!role) {
            return res.status(StatusCodes.CREATED).json(doc);
          }

          // Add role to User Model
          
          await UserModel.findById(user._id).then(async (usr) => {
            if (!usr.roles.includes(role)) {
              
              await usr.updateOne(
                { roles: [...usr.roles, role] },
                { returnDocument: "after" }
              );
            }
          });
          return res.status(StatusCodes.CREATED).json(doc);
        })
        .catch((error) => {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: `Failed to create ${dbModel.modelName}`,
          });
        });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: `Failed to create ${dbModel.modelName}`,
      });
    });
};

const findByIdAndUpdate = (dbModel, id, update, res) => {

  dbModel.findByIdAndUpdate(
    id,
    update,
    { returnDocument: "after" },
    (err, doc) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: `Failed to update ${dbModel.modelName} with id: ${id}`,
        });
      }
      if (!doc) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: true,
          message: `Failed to update ${dbModel.modelName} with id: ${id}, ${dbModel.modelName} does not exist.`,
        });
      }
      res.status(StatusCodes.OK).send(doc);
    }
  );
};

const findByIdAndDelete = (dbModel, id, res) => {
  dbModel.findByIdAndDelete(id, (err, doc) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: `Failed to delete ${dbModel.modelName} with id: ${id}`,
      });
    }
    res.sendStatus(StatusCodes.NO_CONTENT);
  });
};

module.exports = {
  findAll,
  findById,
  create,
  findByIdAndUpdate,
  findByIdAndDelete,
};
