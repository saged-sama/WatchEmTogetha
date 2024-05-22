export const actions = {
    fileupload: async ({ request }: { request: any }) => {
        const data = await request.formData();
        const file = data.get("file");
        if(file){
            const filename = file.name;
            const ftype = file.type.split("/");
            const ext = ftype[ftype.length-1];

            
        }
    }
}