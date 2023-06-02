//action that loads songs from our server component
import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getSongsByUserId = async (): Promise<Song[]> => { //Song is defined in types.ts
    const supabase = createServerComponentClient({ //server component supabase client
        cookies: cookies
    });  

  const { data: sessionData, 
    error: sessionError
} = await supabase.auth.getSession();

if (sessionError) {
console.log(sessionError.message);
return [];
   }

   const { data, error} = await supabase
   .from('songs')
   .select('*')
   .eq('user_id', sessionData.session?.user.id)
   .order('created_at', {ascending: false});

   if (error) {
    console.log(error.message);

};

return (data as any) || [];
}

export default getSongsByUserId;