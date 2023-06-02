//action that loads songs from our server component
import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";
import getSongs from "./getSongs";

const getSongsByTitle = async (title: string): Promise<Song[]> => { //Song is defined in types.ts
    const supabase = createServerComponentClient({ //server component supabase client
        cookies: cookies
    }); 
    
    if (!title) {
        const allSongs = await getSongs();
        return allSongs;
    }
    
    const { data, error } =await supabase //fetching our songs
    .from('songs')
    .select('*') //everything inside using *
    .ilike('title', `%${title}%`)
    .order('created_at', { ascending: false });

    if (error) {
        console.log(error.message);
    }

    return (data as any) || [];
};

export default getSongsByTitle;