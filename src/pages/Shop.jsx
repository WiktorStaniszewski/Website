import '../styles/Shop.css'
function Shop() {
    const products = 
    [
        {name:"product_1", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"espresso", flavours:"red fruits, tangerines, mango",image:"/images/gwatemala-meissa.jpg" },
        {name:"product_2", price:2, roastery:"PalomaRoastery", category:"coffee_beans", type:"filter", flavours:"red fruits, tangerines, mango",image:"/images/kenia_matunda.jpg" },
        {name:"product_3", price:3, roastery:"PalomaRoastery", category:"coffee_beans", type:"espresso", flavours:"red fruits, tangerines, mango",image:"/images/Rwanda-Gisanga.jpg" },
        {name:"product_4", price:4, roastery:"PalomaRoastery", category:"coffee_beans", type:"filter", flavours:"red fruits, tangerines, mango",image:"/images/gwatemala-meissa.jpg" },
        {name:"product_5", price:5, roastery:"PalomaRoastery", category:"coffee_beans", type:"espresso", flavours:"red fruits, tangerines, mango",image:"/images/kenia_matunda.jpg" },
        {name:"product_6", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"filter", flavours:"red fruits, tangerines, mango",image:"/images/Rwanda-Gisanga.jpg" },
        {name:"product_7", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"espresso", flavours:"red fruits, tangerines, mango",image:"/images/gwatemala-meissa.jpg" },
        {name:"product_8", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"filter", flavours:"red fruits, tangerines, mango",image:"/images/kenia_matunda.jpg" },
        {name:"product_9", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"espresso", flavours:"red fruits, tangerines, mango",image:"/images/Rwanda-Gisanga.jpg" },
        {name:"product_10", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"filter", flavours:"red fruits, tangerines, mango",image:"/images/gwatemala-meissa.jpg" },
        {name:"product_11", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"espresso", flavours:"red fruits, tangerines, mango",image:"/images/kenia_matunda.jpg" },
        {name:"product_12", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"filter", flavours:"red fruits, tangerines, mango",image:"/images/Rwanda-Gisanga.jpg" },
        {name:"product_13", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"espresso", flavours:"red fruits, tangerines, mango",image:"/images/gwatemala-meissa.jpg" },
        {name:"product_14", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"filter", flavours:"red fruits, tangerines, mango",image:"/images/kenia_matunda.jpg" },
        {name:"product_15", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"espresso", flavours:"red fruits, tangerines, mango",image:"/images/Rwanda-Gisanga.jpg" },
        {name:"product_16", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"filter", flavours:"red fruits, tangerines, mango",image:"/images/gwatemala-meissa.jpg" },
        {name:"product_17", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"espresso", flavours:"red fruits, tangerines, mango",image:"/images/kenia_matunda.jpg" },
        {name:"product_18", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"filter", flavours:"red fruits, tangerines, mango",image:"/images/Rwanda-Gisanga.jpg" },
        {name:"product_19", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"espresso", flavours:"red fruits, tangerines, mango",image:"/images/gwatemala-meissa.jpg" },
        {name:"product_20", price:1, roastery:"PalomaRoastery", category:"coffee_beans", type:"filter", flavours:"red fruits, tangerines, mango",image:"/images/kenia_matunda.jpg" }
    ]
    return (
        <div className="shop-container">
            <div className="grid-products-container">
                {products.map((item) => 
                    <div key={item.name} className="shop-item">
                        <div className="image-container">
                            <img className="item-image" src={item.image} alt={item.name} />
                        </div>
                        <div className="other-traits">
                            <div className="item-name">{item.name}</div>
                            <div className="item-roastery">{item.roastery}</div>
                            <div className="item-price">{item.price}PLN</div>
                        </div>
                    </div>
                    )}
            </div>
        </div>
    )
}
export default Shop