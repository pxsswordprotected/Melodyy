import { Song } from "@/types";
import useAuthModal from "./useAuthModal";
import usePlayer from "./usePlayer";
import { useUser } from "./useUser";

const useOnPlay = (songs: Song[]) => {
    const player = usePlayer();
    const authModal = useAuthModal();
    const { user } = useUser();

    const onPlay = (id: string) => {
        if (!user) {
            return authModal.onOpen(); //ensures only logged in users can play music
        }

        player.setId(id); //id the user clicks on
        player.setIds(songs.map((song) => song.id)); //create a playlist to play
    }

    return onPlay;
}

export default useOnPlay;