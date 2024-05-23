import { supabase } from "$lib/supabaseClient";
import { redirect } from "@sveltejs/kit";
import fs from "fs";
import path from "node:path";

export const POST = async ({ params, cookies }) => {
    const { room } = params;
    const { data, error: selectError } = await supabase.from("rooms").select("movie").eq("roomCode", room);
    
    if (selectError) {
        console.error('Error selecting movie:', selectError);
        throw new Error('Error selecting movie');
    }

    if (data && data[0] && data[0].movie) {
        deleteMovie(data[0].movie);
    }

    const { error: deleteError } = await supabase.from("rooms").delete().eq("roomCode", room);
    if (deleteError) {
        console.error('Error deleting room:', deleteError);
        throw new Error('Error deleting room');
    }

    cookies.set("nickname", "", {
        httpOnly: true,
        secure: false,
        path: `/${room}/room`,
        maxAge: 0
    });

    cookies.set("roomCode", "", {
        httpOnly: false,
        secure: false,
        path: `/${room}/`,
        maxAge: 0
    });

    throw redirect(301, "/");
};

const deleteMovie = async (movie: string) => {
    const staticPath = path.resolve("static");
    const filePath = path.join(staticPath, movie);

    console.log('Attempting to delete file at path:', filePath);

    if (fs.existsSync(filePath)) {
        try {
            fs.unlink(filePath, (err) =>{
                console.log("err: ", err);
            });
            console.log('File deleted successfully');
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    } else {
        console.warn('File does not exist:', filePath);
    }
};
