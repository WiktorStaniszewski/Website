import { FaSpinner } from "react-icons/fa";

export default function Products({ filters }) {
  if (filters.loading) {
    return (
      <section className="flex justify-center items-center w-full min-h-[50vh]">
        <FaSpinner className="animate-spin text-4xl text-(--font-color)" />
      </section>
    );
  }

  if (filters.error) {
     return (
        <section className="flex justify-center items-center w-full min-h-[50vh]">
           <p className="text-red-400">{filters.error}</p>
        </section>
     )
  }

  return (
    <section className={`flex flex-wrap lg:mt-8 lg:z-[-2] lg:min-h-screen min-h-screen gap-4 ml-4 not-lg:justify-center`}>
      {filters.filteredProducts}
    </section>
  );
}