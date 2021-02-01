/* eslint-disable import/no-extraneous-dependencies */
const Bcrypt = require("bcrypt")
const unique = require("objection-unique")
const Model = require("./Model")

const saltRounds = 10

const uniqueFunc = unique({
  fields: ["username", "email"],
  identifiers: ["id"],
})

class User extends uniqueFunc(Model) {
  static get tableName() {
    return "users"
  }

  set password(newPassword) {
    this.cryptedPassword = Bcrypt.hashSync(newPassword, saltRounds)
  }

  authenticate(password) {
    return Bcrypt.compareSync(password, this.cryptedPassword)
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["username", "email"],

      properties: {
        username: { type: "string" },
        email: { type: "string" },
        cryptedPassword: { type: "string" },
      },
    }
  }

  $formatJson(json) {
    const serializedJson = super.$formatJson(json)

    if (serializedJson.cryptedPassword) {
      delete serializedJson.cryptedPassword
    }

    return serializedJson
  }

  static get relationMappings() {
    const { Review } = require('./index.js')
    return {
      review: {
        relation: Model.HasManyRelation,
        modelClass: Review,
        join: {
          from: "users.id",
          to: "reviews.userId"
        }
      }
    }
  }
}

module.exports = User
