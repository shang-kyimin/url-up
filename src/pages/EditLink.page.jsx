import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SUBJECT_OPTIONS } from "../constants/constant";
import { useForm } from "react-hook-form";
import { client, deleteLink, editLink, getLink } from "../lib/pocketbase";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useState } from "react";


export default function EditLinkPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["link"], queryFn: () => getLink(id) });
  
  client.collection("links").subscribe("*", _ => {
    queryClient.invalidateQueries({ queryKey: ["links"] });
  });

  const mutation = useMutation({
    mutationFn: (value) => editLink(id, value),
    onMutate: () => {
      toast.message("Editing the link");
    },
    onSuccess: () => {
      reset();
      toast.success("Link edited successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLink,
    onMutate: () => {
      toast.message("Deleting the link");
    },
    onSuccess: () => {
      toast.success("Link deleted successfully");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { reset, register, handleSubmit, formState: { errors } } = useForm();

  function onSubmit(value) {
    mutation.mutate(value);
  }

  function onDelete(id) {
    deleteMutation.mutate(id);
  }

  const [ clicked, setClicked ] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex flex-col justify-center max-w-xl gap-4 p-4">
      <Link to="/" className="inline-flex items-center gap-2 group self-start">
        <img src="/assets/move-left.asset.svg" alt="move-left icon" className="w-6 transition group-hover:-translate-x-1" />
        <span className="underline">Go back</span>
      </Link>
      <h4 className="text-2xl font-bold">Edit link - {id}</h4>

      {query.isLoading && <h6>Loading...</h6>}
      {query.isError && <h6>Error when loading, please try again!</h6>}

      {query.isSuccess && (
        <>
          <label>
            <span>Title of your link</span>
            <input type="text" {...register("title", { required: true, value: query.data.title })} placeholder={query.data.title} />
            {errors.title && <span className="text-red-700">* required</span>}
          </label>

          <label>
            <span>Url (Have to be a URL)</span>
            <input type="text" {...register("url", { required: true, value: query.data.url })} placeholder={query.data.url} />
            {errors.url && <span className="text-red-700">* required</span>}
          </label>

          <label className="flex self-start">
            <span>It's {query.data.visited ? "Visited" : "Not visited yet"}!</span>
            {query.data.visited
              ? (
                <button type="button" className={`main-btn ${clicked && "bg-co-base text-co-lavender"}`} onClick={() => setClicked(prev => !prev)} {...register("visited", { value: !clicked })}>
                  Mark as New
                </button>
              )

              : (
                <button type="button" className={`main-btn ${clicked && "bg-co-base text-co-lavender"}`} onClick={() => setClicked(prev => !prev)} {...register("visited", { value: clicked })}>
                  Mark as Visited
                </button>
              )
            }
            {errors.visited && <span className="text-red-700">* required</span>}
          </label>
          
          <label>
            <span>Subject</span>
            <select {...register("subject", { value: query.data.subject, required: true })} multiple className="rounded-lg p-4">
              <option disabled>---</option>
              {SUBJECT_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.subject && <span className="text-red-700">* required</span>}
          </label>

          <div className="flex justify-center gap-2 flex-col sm:items-center sm:flex-row">
            {!mutation.isPending
              ? (
                <button type="submit" className="flex-1 main-btn gap-2 bg-co-base text-co-lavender">
                  <img src="/assets/check.asset.svg" alt="check icon" width={18} height={18} />
                  <span>Update Link</span>
                </button>
              ) : (
                <button type="submit" disabled className="flex-1 main-btn gap-2 hover:scale-100 bg-co-base text-co-lavender">
                  <img src="/assets/check.asset.svg" alt="check icon" width={18} height={18} />
                  <span>Update Link</span>
                </button>
              )
            }

            <button type="button" className="flex-1 main-btn" onClick={() => reset({
              title: query.data.title,
              url: query.data.url,
              visited: query.data.visited,
              user: query.data.user,
              subject: query.data.subject,
            })}>
              Reset
            </button>
          </div>

          <button className="cursor-pointer transition-all hover:bg-transparent hover:scale-100 bg-co-red main-btn border-co-red" onClick={() => onDelete(query.data.id)} type="button">
            <img src="/assets/trash.asset.svg" alt="trash icon" className="w-4" />
          </button>
        </>
      )}

      <Toaster richColors />
    </form>
  );
}


