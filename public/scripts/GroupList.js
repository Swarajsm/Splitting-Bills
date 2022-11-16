const groupName = document.querySelector('.group-input')
const addButton = document.querySelector(".add-group-btn")

const groupList = document.querySelector(".Group-List")
addButton.addEventListener("click", addGroup);
const Groups = [];
let added = groupName.value;
Groups.push(added)
console.log(Groups);

function addGroup(event){
    
    const newGroup = document.createElement("li");
    newGroup.classList.add("group")
    const card = document.createElement("div")
    newGroup.appendChild(card);
    card.classList.add("card")
    card.classList.add("w-50")
    card.classList.add("h-25")
    
    const cardBody = document.createElement("div")
    card.appendChild(cardBody);
    cardBody.classList.add("card-body");
    
    const name = document.createElement("h5")
    name.innerText= groupName.value;
    cardBody.appendChild(name);
    const x = document.createElement("A");
    const t = document.createTextNode("Details");
    x.setAttribute("href", "#");
    x.appendChild(t);
    cardBody.appendChild(x);
    x.classList.add("btn")
    x.classList.add("btn-primary")
    x.classList.add("details-btn")
    groupList.appendChild(newGroup)

    post('/GroupList.js', function(req, res) {// success callback
			var name = groupName;
            Groups =[];
            Groups.push(name)	
	});

}