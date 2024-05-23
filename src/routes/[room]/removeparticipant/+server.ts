import { supabase } from "$lib/supabaseClient";
import { redirect } from "@sveltejs/kit";

export const POST = async({ cookies }: {cookies: any}) =>{
    const nickname = cookies.get("nickname");
    const roomCode = cookies.get("roomCode");

    if(!nickname || !roomCode){
        throw redirect(301, "/");
    }
    const {error} = await supabase.from("participants").delete().match({nickname, roomCode});

    if(error){
        throw error;
    }
    const {data} = await supabase.from("participants").select("*").eq("roomCode", roomCode);
    if(data.length === 0){
        const {error: fetchError} = await supabase.from("rooms").delete().match({roomCode});
        if(fetchError){
            throw fetchError;
        }
    }
    throw redirect(301, "/");
}