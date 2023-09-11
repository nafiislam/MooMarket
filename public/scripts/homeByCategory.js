let arr =[]
let arr2 =[]
var searchBar = document.getElementById('search');
var results = document.querySelector('.results');
var searchBar2 = document.getElementById('search2');
var results2 = document.querySelector('.results2');

const currentURL = window.location.href;

const path = currentURL.split('/')[currentURL.split('/').length - 1];

if(path=="cattle"||path=="cattleBid"){
    fetch('/updateSearchList/farmname', {
        method: 'GET'
    })
    .then(res => {
        if (!res.ok) {
          throw new Error('Network response status was vejal');
        }
        return res.json();
    })
    .then(data => {
        arr = [];
        for(let i = 0; i < data.length; i++){
            arr.push(data[i].farm_name);
        }
        // districts.sort()
    })
    .catch(err => {
        console.log(err.Error);
    });
}
else if(path=="meat"){
    arr = ["Rib steak","Rib eye steak","Tri-Trip Roast","T-bone steak","Rump cap","Round cut","Shank Meat","Flank steak","Short plate primal","Foreshank","Brisket cut","Beef chuck"] 
}

fetch('/updateSearchList/sellername', {
    method: 'GET'
})
.then(res => {
    if (!res.ok) {
      throw new Error('Network response status was vejal');
    }
    return res.json();
})
.then(data => {
    arr2 = [];
    for(let i = 0; i < data.length; i++){
        arr2.push(data[i].name);
    }
    // districts.sort()
})
.catch(err => {
    console.log(err.Error);
});


const searchHandler = ()=>{
    var input = searchBar.value;
    if(input!=""){
        var suggestions = arr.filter((data)=>{
            return data.toLowerCase().startsWith(input.toLowerCase());
        }).slice(0, 5);
        
        if(suggestions.length!=0){
            var html = suggestions.map((data)=>{
                return `<li onclick="clickHandler(this)">${data}</li>`
            })
            results.innerHTML =  `<ul>${html}</ul>`;
        }
        else{
            results.innerHTML = '';
        }
    }
    else{
        results.innerHTML = '';
    }
}
const clickHandler = (obj)=>{
    searchBar.value=obj.innerHTML;
    results.innerHTML='';
}

const searchHandler2 = ()=>{
    var input = searchBar2.value;
    if(input!=""){
        var suggestions = arr2.filter((data)=>{
            return data.toLowerCase().startsWith(input.toLowerCase());
        })
        if(suggestions.length!=0){
            var html = suggestions.map((data)=>{
                return `<li onclick="clickHandler2(this)">${data}</li>`
            })
            results2.innerHTML =  `<ul>${html}</ul>`;
        }
        else{
            results2.innerHTML = '';
        }
    }
    else{
        results2.innerHTML = '';
    }
}
const clickHandler2 = (obj)=>{
    searchBar2.value=obj.innerHTML;
    results2.innerHTML='';
}