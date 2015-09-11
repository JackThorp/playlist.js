mongoose  = require 'mongoose'

Schema    = mongoose.Schema

UrlSchema = new Schema
  url:
    type: String
    required: true
    

PlaylistSchema = new Schema
  
  name:
    type: String
    required: true
  
  ownerID:
  	type: Schema.Types.ObjectId
  	required: true

  # Save as reference to user for mongoose population 
  editors: [{type: Schema.Types.ObjectId, ref: 'User'}]

  tracks: [UrlSchema]

# Virtual method for making HAL response object.
PlaylistSchema.virtual('_links').get ->
  self: "playlists/" + this._id 



module.exports = mongoose.model 'Playlist', PlaylistSchema
