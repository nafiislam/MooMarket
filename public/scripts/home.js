var type
function optionHandler(a){
    if(a==1){
        document.getElementById("searchID").innerHTML = "Farmname";
        document.getElementById("form").setAttribute("action", "/search/farmname");
    }
    else if(a==2){
        document.getElementById("searchID").innerHTML = "Seller name";
        document.getElementById("form").setAttribute("action", "/search/sellername");
    }
    else if(a==3){
        document.getElementById("searchID").innerHTML = "Meat subtype";
        document.getElementById("form").setAttribute("action", "/search/meatsubtype");
    }
    type = a;
    updateSearchList(type);
}

let arr =[]
var searchBar = document.getElementById('search');
var results = document.querySelector('.results');

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

async function updateSearchList(type){
    if(type==1){
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
    else if(type==2){
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
            arr = [];
            for(let i = 0; i < data.length; i++){
                arr.push(data[i].name);
            }
            // districts.sort()
        })
        .catch(err => {
            console.log(err.Error);
        });
    }
    else if(type==3){
        arr = ["Rib steak","Rib eye steak","Tri-Trip Roast","T-bone steak","Rump cap","Round cut","Shank Meat","Flank steak","Short plate primal","Foreshank","Brisket cut","Beef chuck"] 
    }
}

function formHandler(e){
    e.preventDefault();
    console.log("form submitted");
}