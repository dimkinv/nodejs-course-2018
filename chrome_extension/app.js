// -------------------------------------------------------------------------------------------------- //
// Helper methods
// -------------------------------------------------------------------------------------------------- //

function getItemFromPage() {
    const MONEY = /(\d+(.\d+)?)/;
    const hostName = location.host;
    const SUPPORTED_SITES = {
        'aliexpress.com': {
            name: 'ALI',
            getData: getAliExpressData
        },
        'amazon.com': {
            name: 'AMZ',
            getData: getAmazonData
        },
        'ebay.com': {
            name: 'EBY',
            getData: getEbayData
        },
    };

    let currentSite;

    for (let site in SUPPORTED_SITES) {
        if (hostName.includes(site)) {
            currentSite = SUPPORTED_SITES[site];
        }
    }

    if (currentSite) {
        try {
            return currentSite.getData();
        } catch (err) {
            console.log('not supported...');
            return null;
        }

    } else {
        console.log('not supported...');
        return null;
    }


    function getAliExpressData() {
        console.log('ali express');
        return {
            price: getInnerHtml(document.querySelector('[itemprop="price"]')) || getInnerHtml(document.querySelector('[itemprop="lowPrice"]')),
            currency: getInnerHtml(document.querySelector('[itemprop="priceCurrency"]')),
            name: document.title,
            imageUrl: getImgUrl(document.querySelector('[data-role="thumb"')),
            url: location.href
        }
    }

    function getAmazonData() {
        console.log('amazon');
        const priceData = getPrice(getInnerHtml(document.querySelector('.p13n-sc-price')));
        return {
            price: priceData.price,
            currency: priceData.currency,
            name: document.title,
            imageUrl: getImgUrl(document.querySelector('#imgTagWrapperId img')),
            url: location.href
        }
    }

    function getEbayData() {
        console.log('ebay');
        const priceData = getPrice(getInnerHtml(document.querySelector('.display-price') || document.querySelector('[itemprop="price"]')));
        return {
            price: priceData.price,
            currency: priceData.currency,
            name: document.title,
            imageUrl: getImgUrl(document.querySelector('#primary-gallery img') || document.querySelector('[itemprop="image"]')),
            url: location.href
        }
    }

    function getImgUrl(element) {
        if (Array.isArray(element)) {
            return element[0].src || '';
        }
        return element.src || '';
    }

    function getInnerHtml(elm) {
        if (!elm) {
            return ''
        };
        if (Array.isArray(elm)) {
            return elm[0].innerHTML || '';
        }
        return elm.innerHTML;
    }

    function getPrice(combinedPrice, defaultCurrency = '$') {
        const price = MONEY.exec(combinedPrice)[0];
        const currency = combinedPrice.replace(price, '').replace(/ /g, '') || defaultCurrency;

        return {
            price,
            currency
        }
    }
}
// -------------------------------------------------------------------------------------------------- //
// Table generation
// -------------------------------------------------------------------------------------------------- //
function getTableContent(items){ 
    const rows = items.map(getHtmlRow);
    const table = document.createElement('table');
    rows.forEach(row => {
        table.appendChild(row)
    })
    return table;
};

function getHtmlRow(item){
    const td1 = document.createElement('td');
    const itemImg = document.createElement('img');
    itemImg.className = 'item-image';
    itemImg.src = item.imageUrl;
    td1.appendChild(itemImg);

    const td2 = document.createElement('td');
    td2.className = 'multiline-ellipsis';
    const itemLink = document.createElement('a');
    itemLink.target = '_blank';
    itemLink.href = item.url;
    itemLink.innerHTML = item.name;
    td2.appendChild(itemLink);

    const td3 = document.createElement('td');
    td3.className = 'price';
    td3.innerHTML = `${item.currency}${item.price}`;

    const td4 = document.createElement('td');
    const addButton = document.createElement('button');
    addButton.innerHTML = 'I\'m in!';
    addButton.id = 'addItem';
    addButton.itemId='item.id';
    addButton.type = 'button';
    td4.appendChild(addButton);

    const tr = document.createElement('tr');
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    return tr;
}

// -------------------------------------------------------------------------------------------------- //
// inner state
// -------------------------------------------------------------------------------------------------- //
let state = {
    items: []
}

// -------------------------------------------------------------------------------------------------- //
// Actions
// -------------------------------------------------------------------------------------------------- //

function onLoad(){
    //on addGroupClick
    document.getElementById('addGroupShop').addEventListener('click', function addGroupShop(){
        chrome.tabs.executeScript({
            code: '(' + getItemFromPage + ')();' //argument here is a string but function.toString() returns function's code
        }, (results) => {
            console.log('page results:', results[0]);
            if(results[0]){
                fetch('http://localhost:3000/items', {method: 'POST', headers: new Headers({'Content-Type': 'application/json'}), body: JSON.stringify(results[0])}).then(()=>{
                    // const newRow = getHtmlRow(results[0]);
                    // document.getElementsByTagName('table').appendChild(newRow);
                });
            }
        });
    });

    //on addItem
    document.getElementById('addItem').addEventListener('click', function addItem(){
        console.log('clicked');
        console.log(items);
    });
}


// -------------------------------------------------------------------------------------------------- //
// Loading the page
// -------------------------------------------------------------------------------------------------- //
fetch('http://localhost:3000/items').then(res => res.json()).then(items => {
    state.items = items;
    console.log('store mutated: ', items);
    const htmlTableElement = getTableContent(items);
    document.body.appendChild(htmlTableElement);

    onLoad();
});

