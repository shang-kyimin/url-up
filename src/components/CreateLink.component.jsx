import { useForm } from "react-hook-form";
import { createLink } from "../lib/pocketbase";
import { Toaster, toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { SUBJECT_OPTIONS } from "../constants/constant";


export default function CreateLinkComponent() {
  const { reset, register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      url: "",
      visited: false,
      user: "",
      subject: [],
    },
  });

  const mutation = useMutation({
    mutationFn: createLink,
    onMutate: () => {
      toast.message("Adding the link");
    },
    onSuccess: () => {
      reset();
      toast.success("Link created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(value) {
    mutation.mutate({ ...value });
  }

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex flex-col justify-center max-w-xl gap-4 p-4">
        <h4 className="text-lg font-bold">Add link</h4>

        <label>
          <span>Title of your link</span>
          <input type="text" {...register("title", { required: true })} placeholder="Learn Biomolecules" />
          {errors.title && <span className="text-red-700">* required</span>}
        </label>

        <label>
          <span>Url (Have to be a URL)</span>
          <input type="text" {...register("url", { required: true })} placeholder="https://thecrashcourse.com/topic/biology/" />
          {errors.url && <span className="text-red-700">* required</span>}
        </label>

        <label className="flex-row gap-2">
          <span>Visited</span>
          <input type="checkbox" {...register("visited")} />
          {errors.visited && <span className="text-red-700">* required</span>}
        </label>
        
        <label>
          <span>Subject</span>
          <select multiple {...register("subject", { required: true })} className="rounded-lg p-4">
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
                <img src="/assets/add.asset.svg" alt="add icon" width={18} height={18} />
                <span>Add Link</span>
              </button>
            ) : (
              <button type="submit" disabled className="flex-1 main-btn gap-2 hover:scale-100 bg-co-base text-co-lavender">
                <img src="/assets/add.asset.svg" alt="add icon" width={18} height={18} />
                <span>Add Link</span>
              </button>
            )
          }

          <button type="button" className="flex-1 main-btn" onClick={() => reset()}>
            Reset
          </button>
        </div>
      </form>

      <Toaster richColors />
    </section>
  );
}


