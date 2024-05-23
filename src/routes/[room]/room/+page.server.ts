import { supabase } from '$lib/supabaseClient.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
    const nickname = cookies.get("nickname");
    const roomCode = cookies.get("roomCode");

    const { data: participantData, error: participantError } = await supabase.from("participants")
        .select("*").eq("roomCode", roomCode).eq("nickname", nickname);
    if (participantError) {
        throw participantError;
    }
    if (participantData.length === 0) {
        throw redirect(301, `/${roomCode}/participant`);
    }

    if (!nickname && roomCode) {
        throw redirect(301, `/${roomCode}/participant`);
    }
    else if (!roomCode) {
        throw redirect(301, "/");
    }

    return {
        nickname: nickname,
        roomCode: roomCode
    }
}