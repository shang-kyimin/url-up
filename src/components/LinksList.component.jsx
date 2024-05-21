import { Toaster, toast } from "sonner";
import { client, deleteLink, editVisitedOrNot, getLinks } from "../lib/pocketbase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";


export default function LinksListComponent() {
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: ["links"], queryFn: getLinks });

  client.collection("links").subscribe("*", _ => {
    queryClient.invalidateQueries({ queryKey: ["links"] });
  });

  const mutation = useMutation({
    mutationFn: editVisitedOrNot,
    onMutate: () => {
      toast.message("Editing the link");
    },
    onSuccess: () => {
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
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onDelete(id) {
    deleteMutation.mutate(id);
  }

  function refresh(event) {
    event.target.classList.toggle("rotate");
    window.setTimeout(() => {
      event.target.classList.toggle("rotate");
    }, 1000);
    queryClient.resetQueries({ queryKey: ["links"] });
  }

  function changeVisitedLink(data) {
    mutation.mutate({ ...data, visited: !data.visited });
    queryClient.resetQueries({ queryKey: ["links"] });
  }

  return (
    <section className="py-1 px-4 space-y-4">
      <div className="w-full">
        <div className="flex gap-4 items-center mb-4 border-b border-co-base">
          <h4 className="font-bold text-2xl">Links</h4>
          <button type="button" className="hover:scale-110" onClick={refresh}>
            <img src="/assets/refresh.asset.svg" alt="refresh icon" className="w-4" />
          </button>
        </div>

        {query.isLoading && <h6>Loading...</h6>}
        {query.isError && <h6>Error when loading, please try again!</h6>}

        {query.isSuccess &&
          query.data.map(link => (
            <div key={link.id} className="pt-1">
              <div className="flex flex-start items-center gap-4 linkslist">
                <p className="block sm:hidden">
                  {link.visited ? "Visited" : "New"}
                </p>

                <h6 className="font-semibold text-nowrap overflow-auto flex gap-4">
                  <a href={link.url} className="block sm:hidden" target="_blank" onClick={() => changeVisitedLink(link)}>{link.title}</a>
                  <span className="hidden sm:block">{link.title}</span>

                  <div className="flex gap-2">
                    [
                    {link.subject.map((sub) => (
                      <span className="text-nowrap">{sub},</span>
                    ))}
                    ]
                  </div>
                </h6>
                <a href={link.url} className="hidden sm:block underline" target="_blank" onClick={() => changeVisitedLink(link)}>{new URL(link.url).hostname}</a>

                <p className="hidden sm:block">
                  {link.visited ? "Visited" : "New"}
                </p>

                <div className="flex justify-center items-baseline gap-2 ml-auto">
                  <Link to={`edit/${link.id}`} className="inline-block">
                    <button className="cursor-pointer transition-all hover:scale-110 w-4">
                      <img src="/assets/pencil.asset.svg" alt="pencil icon" />
                    </button>
                  </Link>
                  <button className="cursor-pointer transition-all hover:scale-110 w-4" onClick={() => onDelete(link.id)}>
                    <img src="/assets/trash.asset.svg" alt="trash icon" />
                  </button>
                </div>
              </div>

              <hr className="border-co-base" />
            </div>
          ))
        }
        {query.isSuccess && query.data?.length === 0 && <h6>There's no link yet, add some :)</h6>}
      </div>

      <Toaster richColors />
    </section>
  );
}


