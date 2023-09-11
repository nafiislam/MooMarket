let arr =['dgfd','dghh']
var searchBar = document.getElementById('search');
var results = document.querySelector('.results');

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

const searchHandler = ()=>{
    var input = searchBar.value;
    if(input!=""){
        var suggestions = arr.filter((data)=>{
            return data.toLowerCase().startsWith(input.toLowerCase());
        })
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