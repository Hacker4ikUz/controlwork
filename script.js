let url = 'https://tranquil-gorge-79901.herokuapp.com/users'
function react() {
   axios.get(url)
      .then(res => reload(res.data.data))
      .catch(err => console.log(err))
}

react()


function reload(arr) {
let all = document.querySelector('.all')
all.innerHTML = `Общее число сотрудников: ${arr.length}`
let sotrudniki = document.querySelector('.new')
sotrudniki.innerHTML = ''
for(let item of arr) {
sotrudniki.innerHTML += `<div class="sotrudniki" data-on="${item.salarySupplement}">
<div class="name">
   <img src="${item.photo}" class="photosotrudnika">
   <p>${item.name} ${item.surname}</p>
</div>
<div class="price">
   <input type="text" value="${item.salary + '$'}">
</div>
<div class="checkbox">
   <input type="checkbox" name="premiya" class="inputch">
</div>
<div class="pechenkanddel">
   <img src="./img/pechenka.png" class="pechen">
   <img src="./img/del.png" class="del">
</div>
</div>`   
let ph = document.querySelectorAll('.photosotrudnika')
let overlay = document.querySelector('.overlay')
let modal = document.querySelector('.modal')
ph.forEach(phot => {
   phot.onclick = (e) => {
      modal.style.display = 'flex'
      let edname = document.querySelector('.edname')
      let edprice = document.querySelector('.edprice')
      let edprem = document.querySelector('.edprem')
      let image = document.querySelector('.image')
      image.src = e.target.src
      edname.innerHTML = `Имя: ${e.target.nextSibling.nextSibling.innerHTML}`
      edprice.innerHTML = `З/П: ${item.salary}$`
      edprem.checked = `Премия: ${item.salarySupplement}`
   }
})
if(item.salarySupplement) {
    document.querySelector('.edprem input').checked = item.salarySupplement
}
overlay.onclick = () => {
   modal.style.display = 'none'
}
let dels = document.querySelectorAll('.del')
dels.forEach(delet => {
    delet.onclick = (e) => {
        let id = `${item._id}`
        axios.delete(`${url}/${id}`)
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    react()
                }
            })
    }
});
}
}
let arr_local_filter = JSON.parse(localStorage.getItem('users')) || []
let btns = document.querySelectorAll('.btn')
        btns.forEach(btn => {
            btn.onclick = () => {
                btns.forEach(btn => {
                    btn.classList.remove('active_btn')
                });
                btn.classList.add('active_btn')
                if (btn.innerHTML === 'Получит премию') {
                    let array2 = []
                    axios.get(url)
                        .then(res => {
                            res.data.data.filter(elem => {
                                if (elem.salarySupplement) {
                                    array2.push(elem)
                                    reload(array2)
                                }
                            })
                        })
                }

                if (btn.innerHTML === 'Посмотреть всех') {
                    axios.get(url)
                        .then(res => {
                            reload(res.data.data)
                        })
                }
                if (btn.innerHTML === 'З/П больше 1000$') {
                    let salary = []
                    axios.get(url)
                        .then(res => {
                            res.data.data.filter(elem => {
                                if (+elem.salary > 1000 ) {
                                    salary.push(elem)
                                    reload(salary)
                                }
                            })
                        })
                }
                if (btn.innerHTML === 'На повышение') {
                    let up = JSON.parse(localStorage.getItem('upp')) || []
                    reload(up)  

                }
            }
        });
        
        axios.get(url)
        .then(res => {
            let searchone = document.querySelector('.searchone')
            searchone.onkeyup = () => {
                let filtered = res.data.data.filter(item => item.name.toLowerCase().includes(searchone.value.toLowerCase()))
                reload(filtered)
            }
        })

        
        let arr_local_pechen = []
        let pechens = document.querySelectorAll('.pechen')
        pechens.forEach(pechenka => {
            pechenka.onclick = (e) => {
               console.log('clk');
                e.target.parentNode.parentNode.classList.add('active_text')
                let id1 = e.target.parentNode.parentNode.id
    
                let up2 = JSON.parse(localStorage.getItem('users')) || []
            
                for(let elem of up2) {
                    if(elem._id === id1) {
                        arr_local_pechen.push(elem)
                        localStorage.setItem('upp', JSON.stringify(arr_local_pechen))
                    }
                }
            }
        });


        let inp = document.querySelectorAll('.checkbox .inputch')
        inp.forEach(input => {
            if (input.parentNode.parentNode.getAttribute('data-on') === 'true') {
                input.checked = 'checked'
            }
            input.onclick = (e) => {
                let id = e.target.parentNode.parentNode.id
                let array = []
                axios.get(url)
                    .then(res => {
                        array = res.data.data.filter(elem => elem._id === id)
                        for (let elem of array) {
                            elem.salarySupplement = !elem.salarySupplement
                            axios.patch(`${url}/${id}, elem`)
                                .then(res => console.log(res))
                        }
                        console.log(array);
                    })
            }
        });
let form_add = document.forms.addsotrudnik
 
form_add.onsubmit = (e) => { 
   e.preventDefault() 
 
   submit() 
} 
 
let arr_local = [] 
 
function submit() { 
   let user = {} 
 
   let fm = new FormData(form_add) 
 
   fm.forEach((value, key) => { 
      user[key] = value 
   }); 
 
   arr_local.push(user) 
 
   axios.post(url, user) 
      .then(res => console.log('posted')) 
    
   react() 
 
   axios.get(url) 
      .then(res => { 
         localStorage.setItem('users', JSON.stringify(res.data.data)) 
 
      }) 
}