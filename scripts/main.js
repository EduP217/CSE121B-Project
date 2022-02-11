let currentDate = new Date()

document.querySelector('#currentYear').innerHTML = currentDate.getFullYear();

let ratingSelected = 0;
let recipes = [];

let fetchRecipes = fetch("https://run.mocky.io/v3/a8e299b6-ed6c-499c-9182-ac431c926128")
    .then((res) => { 
        return res.json() 
    })
    .then((list) => {
        recipes = list;
    })
    .finally(()=>{
        toogleLoading();
        filters(recipes);
    });

const toogleLoading = () => {
    document.querySelector('.loader').classList.toggle('active');
}

const buildCardElements = (list) => {
    let root = document.querySelector('#resultPanel');
    root.innerHTML = "";

    list.forEach(i => {
        let card = document.createElement('div');
        card.classList.add("card");

        let cardBody = document.createElement('div');
        cardBody.classList.add("card-body");

        let image = document.createElement('img');
        image.setAttribute('src',i['url']);
        image.setAttribute('alt',i['name']);

        let unitPrice = parseFloat(i['unit_price']).toFixed(2);
        let offerPrice = parseFloat(i['offer_price']).toFixed(2);

        cardBody.appendChild(image);

        if(offerPrice != unitPrice){
            let offer = document.createElement('div');
            offer.classList.add("price");
            offer.classList.add("offer");
            offer.innerHTML = `Offer: $${offerPrice}`;

            cardBody.appendChild(offer);
        }

        let price = document.createElement('div');
        price.classList.add("price");
        price.innerHTML = `Price: $${unitPrice}`;

        cardBody.appendChild(price);

        let cardFooter = document.createElement('div');
        cardFooter.classList.add("card-footer");
        
        let title = document.createElement('h4');
        title.classList.add("recipe-name");
        title.innerHTML = i['name'];
        
        let description = document.createElement('p');
        description.classList.add("recipe-description");
        description.innerHTML = i['description'];

        let divisor = document.createElement('div');
        divisor.classList.add("divisor");

        let stars = document.createElement('div');
        stars.classList.add("stars");

        let ratingValue = i['rating'].split("|");

        for(let i=1; i<=5; i++){
            let star = document.createElement('span');
            star.classList.add("star");

            if(i <= ratingValue[0]){
                star.classList.add("colored");
            }

            stars.appendChild(star);
        }

        let comments = document.createElement('span');
        comments.classList.add("comments");
        comments.innerHTML = ratingValue[1];

        cardFooter.appendChild(title);
        cardFooter.appendChild(description);
        cardFooter.appendChild(divisor);
        cardFooter.appendChild(stars);
        cardFooter.appendChild(comments);

        card.appendChild(cardBody);
        card.appendChild(cardFooter);

        root.appendChild(card);
    });
    toogleLoading();
}

const filters = (list, search = '', sort = 0) => {
    toogleLoading();
    let outputList = list;

    if(search != ''){
        console.log(search);
        outputList = outputList.filter((x) => {
            if(x['name'].toLowerCase().includes(search.toLowerCase())) return x
        });
    }

    console.log(ratingSelected);
    if(ratingSelected > 0){
        outputList = outputList.filter((x) => {
            let ratingValue = x['rating'].split("|");
            if(parseInt(ratingValue[0]) == ratingSelected) return x
        });
    }

    if(sort == 0){
        outputList = outputList.sort((a,b) => {
            if(a['name'].toLowerCase() < b['name'].toLowerCase()) { return -1; }
            if(a['name'].toLowerCase() > b['name'].toLowerCase()) { return 1; }
            return 0;
        })
    } else {
        outputList = outputList.reverse();
    }

    buildCardElements(outputList);
}

const delay = (fn, ms) => {
    let timer = 0
    return function(...args) {
        clearTimeout(timer)
        timer = setTimeout(fn.bind(this, ...args), ms || 0)
    }
}

const filterRecipes = (e) => {
    let searchValue = document.querySelector('#searchDessert').value;
    let sortValue = document.querySelector('#sortDessert').value;

    filters(recipes, search = searchValue, sort = sortValue);
}

const updateRatingSelected = (e) => {
    ratingSelected = e.target.value;
    filterRecipes();
}

document.querySelector('#searchDessert').addEventListener('keyup', delay(filterRecipes, 250));
document.querySelector('#searchDessert').addEventListener('search', delay(filterRecipes, 250));
document.querySelector('#sortDessert').addEventListener('change', delay(filterRecipes, 250));
document.querySelectorAll('input[name="ratingDessert"]').forEach((e) => {
    e.addEventListener("change", delay(updateRatingSelected, 250));
});