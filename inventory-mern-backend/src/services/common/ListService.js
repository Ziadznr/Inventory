const ListService=async (Request,DataModel,SearchArray) => {
    try {
        let pageNo=Number(Request.params.pageNo);
        let perPage=Number(Request.params.perPage);
        let searchValue=Request.params.searchKeyword;
        let UserEmail = Request.headers['email'];

        let skipRow = (pageNo - 1) * perPage;
        let data;

        if (searchValue!=='0') {
            let searchQuery={$or:SearchArray}
            data=await DataModel.aggregate([
                {$match:{ UserEmail: UserEmail }},
                {$match:searchQuery},
                {$facet: {
                    Total:[{$count:'count'}],
                    Rows:[{$skip:skipRow},{$limit:perPage}]
                }
            }
            ])
        } else {
            data=await DataModel.aggregate([
                {$match:{ UserEmail: UserEmail }},
                {$facet: {
                    Total:[{$count:'count'}],
                    Rows:[{$skip:skipRow},{$limit:perPage}]
                }
            }
            ])
        }
        return { success: 'success', data: data };
    } catch (error) {
        return { status: 'fail', data: error.toString() };
        
    }
}

module.exports = ListService;