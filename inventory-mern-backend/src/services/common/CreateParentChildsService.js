const { default: mongoose } = require("mongoose");

const CreateParentChildsService = async(Request,ParentModel,ChildsModel,JoinPropertyName) => {

    const session = await mongoose.startSession();
    try {

        // Begin transaction
        await session.startTransaction();

        // Parent data creation
        let Parent=Request.body['Parent'];
        Parent.UserEmail=Request.headers['email'];
        let ParentCreation= await ParentModel.create([Parent],{ session });

        // Childs data creation
        if(ParentCreation['_id']){
            try {
                let Childs=Request.body['Childs'];
                await Childs.array.forEach((element) => {
                    element[JoinPropertyName]=ParentCreation[0]['_id'];
                    element['UserEmail']=Request.headers['email'];
                });

                let ChildsCreation=await ChildsModel.insertMany(Childs, { session });

                // Transaction success
                await session.commitTransaction();
                session.endSession();

                return {status:'success', data:{Parent:ParentCreation, Childs:ChildsCreation}};
            } catch (error) {
                await ParentModel.remove({_id:ParentCreation['_id']});
                return {status:'fail', data:'Childs creation failed, Parent data deleted'};
            }
        }else{
            return {status:'fail', data:'Parent creation failed'};
        }
    } catch (error) {
        // Rollback transaction in case of error
        await session.abortTransaction();
        session.endSession();
        return {status:'error', data:error.toString()};
        
    }
}

module.exports = CreateParentChildsService;