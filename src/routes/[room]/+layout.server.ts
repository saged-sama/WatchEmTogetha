import { supabase } from "$lib/supabaseClient";
import { redirect } from "@sveltejs/kit";

export const load = async({ params, cookies }: {params: any, cookies: any}) => {
    const {room} = params;
    const { data: roomData, error: roomError } = await supabase.from("rooms")
        .select("*").eq("roomCode", room);
    if (roomError) {
        throw roomError;
    }
    const roomCode = cookies.get("roomCode");
    if(!roomCode){
        throw redirect(301, "/");
    }
    const { data: croomData, error: croomError } = await supabase.from("rooms")
        .select("*").eq("roomCode", roomCode);
    if (croomError) {
        throw croomError;
    }
    if (roomData.length === 0 || croomData.length === 0) {
        throw redirect(301, "/");
    }
    return {};
}