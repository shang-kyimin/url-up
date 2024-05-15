import CreateLinkComponent from "../components/CreateLink.component";
import LinksListComponent from "../components/LinksList.component";


export default function HomePage() {
  return (
    <main className="space-y-4">
      <CreateLinkComponent />
      <LinksListComponent />
    </main>
  );
}


