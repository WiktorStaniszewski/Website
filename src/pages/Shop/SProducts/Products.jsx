export default function Products({filters}) {
  return (
    <>
      <section className={`flex flex-wrap lg:mt-8 lg:z-[-2] lg:min-h-screen min-h-screen gap-4 ml-4 not-lg:justify-center`}>
        {filters.filteredProducts}
      </section>
    </>
  )
}

