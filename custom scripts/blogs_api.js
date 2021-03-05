const searchForm = document.querySelector('#blog-form');
const input = document.querySelector('#keyword-input');

searchForm.addEventListener('submit', retrieve)

function retrieve(e) {
    e.preventDefault();

    const apiKey = "f6d261527ad14d6b88ae918311d9bc02";
    let topic = input.value;

    let url =
      `https://newsapi.org/v2/everything?q=${topic}&sortBy=popularity&apiKey=${apiKey}`;

    fetch(url).then((res) => {
        return res.json();
    }).then((data) => {
        console.log(data)
    });
}