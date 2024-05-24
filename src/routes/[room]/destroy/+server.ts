import { supabase } from "$lib/supabaseClient";
import { redirect } from "@sveltejs/kit";

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
    const mv = movie.split("/").pop();
    const { error } = await supabase.storage.from("movies").remove(mv);
    if (error) {
        throw error;
    }
};
