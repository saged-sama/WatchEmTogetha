import { supabase } from '$lib/supabaseClient.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
    addparticipant: async ({ request, params, cookies }: {request: any, params: any, cookies: any}) => {
        const reqFormData = await request.formData();
        const nickname = reqFormData.get("nickname");
        const { room } = params;
        try{
            const {error} = await supabase.from("participants").insert([{
                nickname: nickname,
                roomCode: room
            }]);
            if(error){
                throw error;
            }
            cookies.set("nickname", nickname, {
                httpOnly: true,
                secure: false,
                path: `/${room}/room`,
                maxAge: 60*60*6
            });
        } catch(err){
            throw err;
        }
        throw redirect(301, `/${room}/room`);
    }
}