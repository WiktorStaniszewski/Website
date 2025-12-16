export default function Products({filters}) {
  return (
    <>
      <section className={`flex justify-around flex-wrap lg:mt-8 lg:z-[-2] lg:min-h-screen min-h-screen gap-4`}>
        {filters.filteredProducts}
      </section>
    </>
  )
}

