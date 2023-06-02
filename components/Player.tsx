"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContet from "./PlayerContent";

const Player =() => {
    const player = usePlayer();
    const { song } = useGetSongById(player.activeId);

    const songUrl = useLoadSongUrl(song!);  //read song path in storage to load song

    if (!song || !songUrl || !player.activeId) { //don't load player if nothing is set
        return null;
    }

    return (   
        <div
        className="
        fixed
        bottom-0
        bg-black
        w-full
        py-2
        h-[80px]
        px-4
        "
        > 
            <PlayerContet
            key={songUrl} //whenever a key changes, it destroys the element that was using it and re renders a new element. makes it easier to change songs, etc
            song = {song}
            songUrl = {songUrl}
            />
        </div>
    )
}

export default Player;