mongoose  = require 'mongoose'
crypto    = require 'crypto'
jwt       = require 'jsonwebtoken'
config    = require '../config'


UserSchema = new mongoose.Schema(
  username:
    type: String
    trim: true
    default: ''
    required: 'Please fill in your username'

  hash:
    type: String
    default: ''

  salt:
    type: String
)

UserSchema.methods.setPassword = (password) ->
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = this.hashPassword password

UserSchema.methods.hashPassword = (password) ->
  crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString 'hex'

UserSchema.methods.authenticate = (password) ->
  this.hash == this.hashPassword password

UserSchema.methods.map = ->
  user:
    _id: this._id
    username: this.username
  accessToken: jwt.sign username: this.username, config.token_secret

UserSchema.methods.read = ->
  _id: this._id
  username: this.username

module.exports = UserSchema