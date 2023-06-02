"use client";

import uniqid from "uniqid";
import useUploadModal from "@/hooks/useUploadModal";
import { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { SubmitHandler } from "react-hook-form/dist/types";
import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const UploadModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const uploadModal = useUploadModal();
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,
        }
    })

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
          uploadModal.onClose();
        }
      }

      const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if (!imageFile || !songFile || !user) {
              toast.error('Missing fields');
              return;
            }

            const uniqueID = uniqid();
            //Upload songs
            const {
              data: songData,
              error: songError,
            } = await supabaseClient
            .storage
            .from('songs')
            .upload(`song-${values.title}-${uniqueID}`, songFile, { //how we fetch from storage later on, stored in database useing title, uniqueID, etc
                cacheControl: '3600',
                upsert: false
            });

            if (songError) {
              setIsLoading(false);
              return toast.error('Failed to upload song')
            }
            //upload image
            const {
              data: imageData,
              error: imageError,
            } = await supabaseClient
            .storage
            .from('images')
            .upload(`image-${values.title}-${uniqueID}`, imageFile, {
                cacheControl: '3600',
                upsert: false
            });
           //Uplaoding an image error
            if (imageError) {
              setIsLoading(false);
              return toast.error('Failed to upload image')
            }

            const { 
              error: supabaseError
            } = await supabaseClient
            .from('songs') //SQL table
            .insert({
              user_id: user.id, //SQL columns
              title: values.title,
              author: values.author,
              image_path: imageData.path,
              song_path: songData.path
            });

            if (supabaseError) { //if error to upload to SQL
              setIsLoading(false); 
              return toast.error(supabaseError.message); //gives supabase error message
            }

            router.refresh(); // if there's not an error to upload to sql, useful for when we list out our songs
            setIsLoading(false);
            toast.success('Song uploaded')
            reset(); //reset form after successful upload
            uploadModal.onClose(); //closes forum once successfully uploaded

        } catch (error) {
          toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
      }

    return (
        <Modal
        title="Add a song"
        description="Upload an mp3 file"
        isOpen={uploadModal.isOpen}
        onChange={onChange}
        >
            <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
            >
              <Input 
                id="title"
                disabled={isLoading}
                {...register('title', { required: true})}
                placeholder="Song title"
              />
              <Input 
                id="author"
                disabled={isLoading}
                {...register('author', { required: true})}
                placeholder="Song author"
              />
              <div>
                <div className="pb-1">
                    Select a song file (must be .mp3)
                </div>
                <Input 
                id="song"
                type="file"
                disabled={isLoading}
                accept=".mp3"
                {...register('song', { required: true})}
              />
              </div>
              <div>
                <div className="pb-1">
                    Select an image
                </div>
                <Input 
                    id="image"
                    type="file"
                    disabled={isLoading} 
                    accept="image/*"
                    {...register('image', { required: true})}
              />
              </div>
              <Button disabled={isLoading} type="submit">
                Create
              </Button>
            </form>
        </Modal>
    );
}

export default UploadModal;