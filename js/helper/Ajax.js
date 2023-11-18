export const HTTPRequest = {
    async callProcedure(url,json){
        try{
            const response = await fetch(url,{
                method: 'POST',
                body: JSON.stringify(json),
                headers: {
                    'Content-Type': 'application/json',
                    'mode': 'no-cors'
                }
            });
            const data = await response.json();
            return data;
        }
        catch(error){
            return {
                status:false,
                message: error,
                data: [],
            }
        }
    }
}