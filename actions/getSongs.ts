//action that loads songs from our server component
import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getSongs = async (): Promise<Song[]> => { //Song is defined in types.ts
    const supabase = createServerComponentClient({ //server component supabase client
        cookies: cookies
    });  

    const { data, error } =await supabase //fetching our songs
    .from('songs')
    .select('*') //everything inside using *
    .order('created_at', { ascending: false });

    if (error) {
        console.log(error);
    }

    return (data as any) || [];
};

export default getSongs;