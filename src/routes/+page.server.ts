import { supabase } from '$lib/supabaseClient.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
    room: async ({ cookies, request }: { cookies: any, request: any }) => {
        const reqFormData = await request.formData();
        const roomCode = reqFormData.get("roomCode");
        try {
            const isunique = await isUniqueRoom(roomCode);
            if (isunique) {
                await createNewRoom(roomCode);
            }
        } catch (err) {
            throw err;
        }
        cookies.set("roomCode", roomCode, {
            httpOnly: false,
            secure: false,
            path: `/${roomCode}/`,
            maxAge: 60 * 60 * 6
        });
        throw redirect(301, `/${roomCode}/participant`);
    }
}

const isUniqueRoom = async (roomCode: string) => {
    try {
        const { data, error } = await supabase.from("rooms").select("*").eq("roomCode", roomCode);
        if (error) {
            throw error;
        }
        return data.length === 0;
    } catch (err) {
        throw err;
    }
}

const createNewRoom = async (roomCode: string) => {
    try {
        const { error } = await supabase.from("rooms").insert([{
            roomCode: roomCode
        }]);
        if (error) {
            throw error;
        }
    } catch (err) {
        throw err;
    }
}