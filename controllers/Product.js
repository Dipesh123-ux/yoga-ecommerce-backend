const Product = require("../models/Product");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.addProduct = (req, res, next) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    console.log(files);
    if (err) {
      return res.status(400).json({
        err: "Image could not uploaded",
      });
    }

    const { name, description, price, category, rating, stock } = fields;

    let product = new Product({
      name,
      description,
      price,
      category,
      rating,
      stock,
    });

    if (files.photo) {
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.mimetype;
    }

    product
      .save()
      .then((p) => {
        if (p) {
          return res.status(200).json({
            message: "success",
            product: p,
          });
        }
      })
      .catch((err) => {
        return res.status(400).json({
          error: err,
        });
      });
  });
};

exports.getAllProducts = (req, res) => {
  Product.find({})
    .then((p) => {
      return res.status(200).json({
        message: "products",
        data: p,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        message: "error",
        error: err,
      });
    });
};

exports.deleteProduct = (req, res) => {
  const _id = req.params.id;
  Product.findByIdAndDelete(_id)
    .then(() => {
      return res.json({
        message: "successfully deleted",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.editProduct = (req, res, next) => {
  let _id = req.params.id;
  Product.findOne({ _id: _id })
    .then((p) => {
      let form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.parse(req, (err, fields, files) => {
        if (err) {
          return res.status(400).json({
            error: "Image could not upload",
          });
        }

        p = _.merge(p, fields);

        if (files.photo) {
          if (files.photo.size > 20000000) {
            return res.status(400).json({
              error: "Image should be less then 2mb in size",
            });
          }
          p.photo.data = fs.readFileSync(files.photo.filepath);
          p.photo.contentType = files.photo.type;
        }

        p.save()
          .then((result) => {
            return res.status(200).json({
              message: "updated-successfully",
              result: result,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    })
    .catch((err) => {
      return res.status(400).json({
        error: err,
      });
    });
};


exports.getProductByCategory = (req,res,next)=>{
   let category = req.params.category.toString();
   console.log(category);
   Product.find({category: category}).then((p)=>{
     return res.status(200).json({
      products : p,
      message : "success"
     })
   }).catch((err)=>{
     return res.status(400).json({
       message : "error",
       error : err
     })
   })
}

exports.singleProduct = (req, res) => {
  const _id = req.params.id;
  Product.findOne({ _id: _id }).then((p) => {
     return res.status(200).json({
      product: p
     })
  }).catch((err) => {
     return res.status(400).json({
       error : err
     })
  })
};

exports.photo = (req, res, next) => {
  const _id = req.params.id;
  Product.findOne({ _id: _id })
    .then((p) => {
      res.set("Content-Type", p.photo.contentType);
      return res.send(p.photo.data);
    })
    .catch((err) => {
      return res.status(400).json({
        error: err, 
      });
    });
};
