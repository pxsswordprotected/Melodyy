//action that loads songs from our server component
import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getLikedSongs = async (): Promise<Song[]> => { //Song is defined in types.ts
    const supabase = createServerComponentClient({ //server component supabase client
        cookies: cookies
    }); 
    
    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    const { data, error } = await supabase //fetching our songs
    .from('liked_songs')
    .select('*, songs(*)') //everything inside using *
    .eq('user_id', session?.user.id)
    .order('created_at', { ascending: false });

    if (error) {
        console.log(error);
        return [];
    }
    if (!data) {
        return []
    }

    return data.map((item) => ({
        ...item.songs //spreading a relation that we populated with one song that we'll be loading
    }))
};

export default getLikedSongs;