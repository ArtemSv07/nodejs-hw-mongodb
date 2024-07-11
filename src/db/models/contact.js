import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,

      validate: {
        validator: function (v) {
          return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`,
      },
      required: [true, 'Email required'],
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      required: false,
      default: 'personal',
      enum: ['work', 'home', 'personal'],
    },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    photo: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ContactsCollection = model('contacts', contactSchema);
