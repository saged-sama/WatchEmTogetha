import { supabase } from "$lib/supabaseClient";
import { redirect } from "@sveltejs/kit";

export const POST = async ({ request, cookies, params }: { request: any, cookies: any, params: any }) => {
    const reqData = await request.formData();
    const nickname = reqData.get("nickname");
    const {room} = params;

    const {error} = await supabase.from("participants").delete().eq("roomCode", room).eq("nickname", nickname);
    if(error) throw error;
    cookies.set("nickname", "", {
        httpOnly: true,
        secure: false,
        path: `/${room}/room`,
        maxAge: 0
    });
    throw redirect(301, `/`);
}