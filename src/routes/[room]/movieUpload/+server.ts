import { supabase } from "$lib/supabaseClient.js";
import { redirect } from "@sveltejs/kit";
import fs from "fs";
import path from 'path';

export const POST = async ({ request, params }: { request: any, params: any }) => {
    const { room } = params;
    try {
        const reqFormData = await request.formData();
        const movie = reqFormData.get("movie");
        const ext = path.extname(movie.name);
        const staticpath = path.resolve("static");
        const filepath = path.join(staticpath, `/uploads/${room}${ext}`)

        fs.writeFileSync(filepath, Buffer.from(await movie.arrayBuffer()));

        const { error } = await supabase.from("rooms").update({
            movie: `/uploads/${room}${ext}`,
            isPlaying: false,
            playbacktime: 0
        }).eq("roomCode", room);
        if(error){
            throw error;
        }
    } catch (err) {
        throw err;
    }
    throw redirect(301, `/${room}/room`);
}