const AppError=require('./apperror');
const catchAsync=require('./catchAsynch');

module.exports=(model,owner='vendor')=>
    catchAsync(async(req,res,next)=>{
    const doc = await model.findById(req.params.id);
    if(!doc) return next(new AppError('No document found', 404));
    if(doc[owner].toString()!==req.user.id){
      return next(new AppError('You do not have permission to perform this action', 403));}
    next();
 });
