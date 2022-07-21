const { StatusCodes } = require("http-status-codes");
const { log } = require("console");
const UserModel = require("../models/userModel");

const findAll = (dbModel, query, res) => {
  log(`Getting ${dbModel.modelName}s`);
  dbModel.find(query, (err, docs) => {
    if (err) {
      log(`Failed to get ${dbModel.modelName}s: ${err}`);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: `Failed to get ${dbModel.modelName}s`,
      });
    }

    log(`Got ${dbModel.modelName}s: ${docs}`);
    res.status(StatusCodes.OK).json(docs);
  });
};

const findById = (dbModel, id, res) => {
  log(`Getting ${dbModel.modelName} with id`);
  dbModel.findById(id, (err, doc) => {
    if (err || !doc) {
      log(`${dbModel.modelName} with ${id} does not exist`);
      return res.status(StatusCodes.NOT_FOUND).json({
        error: true,
        message: `Failed to get ${dbModel.modelName} with id: ${id}`,
      });
    }

    log(`Got ${dbModel.modelName}: ${doc}`);
    res.status(StatusCodes.OK).json(doc);
  });
};

const create = (dbModel, query, model, res, role, user) => {
  log(`Creating ${dbModel.modelName}`);
  dbModel
    .findOne(query)
    .then((existingDoc) => {
      if (existingDoc) {
        log(`${dbModel.modelName} already exist, cannot recreate it`);
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: true,
          message: `${dbModel.modelName} already exist, cannot recreate it`,
        });
      }

      dbModel
        .create(model)
        .then(async (doc) => {
          log(`${dbModel.modelName} created successfully`);

          // Should role be added to user?
          if (!role) {
            return res.status(StatusCodes.CREATED).json(doc);
          }

          // Add role to User Model
          log("user: %O", user);
          await UserModel.findById(user._id).then(async (usr) => {
            if (!usr.roles.includes(role)) {
              log(`Adding role ${role} to usr: ${usr}`);
              await usr.updateOne(
                { roles: [...usr.roles, role] },
                { returnDocument: "after" }
              );
              log(`updated user's role`);
            }
          });
          return res.status(StatusCodes.CREATED).json(doc);
        })
        .catch((error) => {
          log(`Failed to create ${dbModel.modelName}: ${error}`);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: `Failed to create ${dbModel.modelName}`,
          });
        });
    })
    .catch((error) => {
      log(`Failed to create ${dbModel.modelName}: ${error}`);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: `Failed to create ${dbModel.modelName}`,
      });
    });
};

const findByIdAndUpdate = (dbModel, id, update, res) => {
  log(`Updating ${dbModel.modelName} with id: ${id}`);
  dbModel.findByIdAndUpdate(
    id,
    update,
    { returnDocument: "after" },
    (err, doc) => {
      if (err) {
        log(`Failed to update ${dbModel.modelName} with id ${id}: ${err}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: `Failed to update ${dbModel.modelName} with id: ${id}`,
        });
      }

      log(
        `Updated ${dbModel.modelName} with id: ${id} updated document: ${doc}`
      );
      if (!doc) {
        log(
          `Failed to update ${dbModel.modelName}, as ${dbModel.modelName} with id ${id} not found`
        );
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
  log(`Deleting ${dbModel.modelName} with id: ${id}`);
  dbModel.findByIdAndDelete(id, (err, doc) => {
    if (err) {
      log(`Failed to delete ${dbModel.modelName} with id: ${id}: ${err}`);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: `Failed to delete ${dbModel.modelName} with id: ${id}`,
      });
    }

    log(`Deleted ${dbModel.modelName} with id: ${id}`);
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
