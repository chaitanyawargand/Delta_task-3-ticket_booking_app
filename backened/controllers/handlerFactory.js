const catchAsync = require('./../utils/catchAsynch');
const AppError = require('./../utils/apperror');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne=Model=>catchAsync(async (req, res, next)=>{
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc) {
      return next(new AppError('No document found with that ID', 404));}
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
exports.updateOne = Model =>catchAsync(async (req, res, next)=>{
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
exports.getOne = (Model,options={}) =>
  catchAsync(async (req, res, next) => {
   let query=Model.findById(req.params.id);
    if (options.populate) {
      query=query.populate(options.populate);
    }
    if (options.select) {
      query=query.select(options.select);
   }
    const doc=await query;
    res.status(200).json({
      status: 'success',
      data: {
       doc
      }
    });
  });
exports.getAll=(Model,options = {},filterFn=null)=>catchAsync(async (req, res, next)=>{
    const filter=typeof filterFn === 'function' ? filterFn(req) : {};
    let query=Model.find(filter);
    if (options.populate) {
      query=query.populate(options.populate);
    }
    if (options.select) {
      query=query.select(options.select);
   }
    const features=new APIFeatures(query, req.query).filter().search().sort();
    const doc=await features.query;
    // Clean _id, __v and nested vendor._id for events 
    const cleanedDocs=doc.map(doc => {
      const obj=doc.toObject({virtuals:true});
      obj.event= doc.event;
      delete obj._id;
      delete obj.__v;
      if(obj.vendor && typeof obj.vendor === 'object') {
        delete obj.vendor._id;
        delete obj.vendor.__v;
      }
      return obj;});
    res.status(200).json({
      status: 'success',
      results: cleanedDocs.length,
       data:cleanedDocs

    });
  });
