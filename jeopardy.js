let categories = [];
/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
async function getCategoryIds() {
    const ids_arr = [];
    const random_offset = Math.floor(Math.random()* 1000);
    const categories = await axios.get(`http://jservice.io/api/categories?count=6&offset=${random_offset}`);
    for(category of categories.data){
        let{id} = category;
        ids_arr.push(id);
    }
    return ids_arr;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    const category = await axios.get(`http://jservice.io/api/category?id=${catId}`);
    let{title, clues} = category.data;
    clues = clues.slice(0,5);
    let cat_arr = {title,clues};
    return cat_arr;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    const WIDTH =6;
    const HEIGHT =5;
    const header = $("#table_head");
    const body = $("#table_body");
    
    
    //getting 6 random ids from the API
    const ids = await getCategoryIds();
    for (const id of ids) {
        let cat = await getCategory(id);
        categories.push(cat)        
    }
    for(category of categories ){
        let{title} = category;
        header.append(`<th scope= "row">${title}</th>`);
    }

       
    for(let i=0;i<HEIGHT;i++){
        body.append(`<tr id=${i} class="h-100"></tr>`)} 
        for(category of categories ){
            let h =0;
            let{clues} = category;
             for (let clue of clues){
                let{answer,question} = clue;
                console.log(question);
                    $(`#${h}`).append(`<td  data-answer = "${answer.replace(/["'"]/g,"&quot;")}" data-question= "${question.replace(/["'"]/g,"&quot;")}" data-showing = ${""} > ?</td>`);
               h +=1;
            }         
        }
}


/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    console.log("clicked");
    console.log(this);
    const cell = $(evt.target);
    if(cell.data("showing") === ""){
        cell.text(cell.data("question"));
        cell.data("showing", "question");

    }
    else if(cell.data("showing") === "question"){
        cell.text(cell.data("answer"));
        cell.data("showing", "answer");
    }
    else{
        evt.stopPropagation()

    }

    
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    await fillTable();

$("table").on("click", "td", function(evt){
    handleClick(evt);
})
}

/** On click of restart button, restart game. */

// TODO

/** On page load, setup and start & add event handler for clicking clues */

// TODO
$("body").on("click","#restart", async function(){
    $("#table_head").empty();
    $("#table_body").empty();

    location.reload()
})
setupAndStart();



