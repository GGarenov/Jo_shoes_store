const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    maxLength: [5, "Product price cannot exceed 5 characters"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  gender: {
    type: String,
    required: [true, "Please specify gender category"],
    enum: {
      values: ["men", "women", "unisex"],
      message: "Please select correct gender category",
    },
  },
  category: {
    type: String,
    required: [true, "Please select category"],
    enum: {
      values: ["casual", "training"],
      message: "Please select correct category",
    },
  },
  attributes: {
    color: {
      type: String,
      required: [true, "Please enter shoe color"],
    },
    material: {
      type: String,
      required: [true, "Please enter shoe material"],
    },
  },
  sizes: [
    {
      size: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 0,
      },
      isEU: {
        type: Boolean,
        default: true,
      },
    },
  ],
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
    },
  ],
  brand: {
    type: String,
    required: [true, "Please enter shoe brand"],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
    },
  ],
  onSale: {
    type: Boolean,
    default: false,
  },
  salePrice: {
    type: Number,
    validate: {
      validator: function (value) {
        return !this.onSale || (value && value < this.price);
      },
      message: "Sale price must be less than regular price",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculated field for total stock across all sizes
productSchema.virtual("totalStock").get(function () {
  return this.sizes.reduce((total, size) => total + size.quantity, 0);
});

module.exports = mongoose.model("Product", productSchema);
