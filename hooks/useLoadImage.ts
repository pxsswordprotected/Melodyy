//helps load an image for songs
import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadImage = (song: Song) => { //used to load the public URL of an image associated with a song.
    //uses the supabaseClient to retrieve the public URL of the image stored in the "images" bucket.
    const supabaseClient = useSupabaseClient();

    if (!song) {
        return null;
    }

    const { data: imageData } = supabaseClient 
    .storage
    .from('images') //from images bucket
    .getPublicUrl(song.image_path);

    return imageData.publicUrl; // returns the public URL of the image. 
};

export default useLoadImage;
