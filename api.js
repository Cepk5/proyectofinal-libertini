let apikey = {
    key:'bc952155-bbb6-4c9f-a34a-9b8d5f45f13c'
}

//listar Top 10
const listTop = async () => {
    const resp = await fetch ('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=' + apikey.key)
    //console.log(resp)
    const data = await resp.json()
    //console.log(data.data)
    const datos = data.data 
    const top = datos.filter((ele) => ele.cmc_rank <= 10)
    //console.log(top)
    top.forEach(element => {
        //console.log(`${element.cmc_rank} ${element.name} ${element.quote.USD.price.toFixed(2)}`)
        const listTop = document.createElement("td")
        listTop.className = "row card-top"
        listTop.innerHTML = `
                                <h3>${element.cmc_rank}</h3>
                                <p>${element.symbol}</p>
                                <p>${element.name}</p>
                                <p>$${element.quote.USD.price.toFixed(2)}</p>
                            `
        top10.append(listTop) 
    });
}

listTop()
.catch(err => {
    console.log(err);
})  
    

const getPrice = async (cryptoCurrency) => {
    try{
        const resp = await fetch ('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=' + apikey.key)
        //console.log(resp)
        const data = await resp.json()
        //console.log(data.data)
        const datos = data.data 
        const cryptoElement = datos.find((ele) => ele.name === cryptoCurrency)
        //console.log(cryptoElement)
        return cryptoElement.quote.USD.price
    }catch(error){
        console.log(error)
    }
}

const btcPrice = await getPrice('Bitcoin')

//console.log(btcPrice.toFixed(2))

