const params = new URLSearchParams(window.location.search)
if(params.has('restaurang')) {
    const restaurang = params.get('restaurang').toLowerCase();
    if(restaurang != 'at' && restaurang != 'hemkop' && restaurang != 'nsu') window.location.href = '/meny';
} else {
    window.location.href = '/meny';
}

let restaurang = params.get('restaurang').toLowerCase();

//Set logo and location
switch(params.get('restaurang').toLowerCase()) {
    case 'at':
        document.getElementById('restaurang-icon').src = 'src/assets/at-logga.png'
        document.getElementById('hemkop-gmap').remove();
        document.getElementById('nsu-gmap').remove();
        break;
    case 'hemkop':
        document.getElementById('restaurang-icon').src = 'src/assets/hemköp-logga.png'
        document.getElementById('at-gmap').remove();
        document.getElementById('nsu-gmap').remove();
        break;
    case 'nsu':
        document.getElementById('restaurang-icon').src = 'src/assets/NSU-logga.png'
        document.getElementById('at-gmap').remove();
        document.getElementById('hemkop-gmap').remove();
        break;
}

//Remove from gmaps
document.querySelector('.restaurang-information .mapouter .gmap_canvas a').remove();

//Retrieve time
let time = new Date();

const hour = time.getHours()
//const timeOfDay = hour >= 16 ? 'dinner' : 'lunch';

const currDay = time.getDay();

/*fetch('../assets/json/mat.json')
  .then(res => res.json())
  .then(data => {
    const menu = data[0]["menu"][timeOfDay];
    //Create Item Displays
    menu.forEach(item => {
        //Create Item Div
        const foodItem = document.createElement("div");
        foodItem.classList.add('item');
        document.getElementById('rätter').appendChild(foodItem);

        //Create Food Image
        const foodImage = document.createElement('img');
        foodImage.src = '../assets/food/grilled-chicken.jpg';
        foodImage.classList.add('item-img');
        foodItem.appendChild(foodImage);

        //Create Name Paragraph
        const name = document.createElement('p');
        const nameText = document.createTextNode(item["name"]);
        name.appendChild(nameText)
        name.classList.add('item-name');
        foodItem.appendChild(name);
        
        //Create Price Paragraph
        const price = document.createElement('p');
        const priceText = document.createTextNode(item["price"]);
        price.appendChild(priceText)
        price.classList.add('item-price');
        foodItem.appendChild(price);
    });
   });*/

   

  function processText(inputText) {
    for(i = 0; i < inputText.length; i++) {
      if(Number(inputText[i]) !== null) {
        return inputText.split(inputText[i]);
      }
    }
    return inputText;
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

if(restaurang == 'hemkop') {

  const lunchWrapper = document.createElement('div');
  lunchWrapper.classList.add('lunch-wrapper');
  lunchWrapper.classList.add('hemkop-lunch-wrapper');

  //Få data snabbare
  /*fetch('https://cors.sizable.workers.dev/https://prao.8m.se/hemkop.html')
  .then((response) => response.text())
  .then((result) => {
    console.log(result);
    const information = document.createElement('div');
    information.innerHTML = result;
    lunchWrapper.innerHTML = information.innerHTML;
    document.body.appendChild(lunchWrapper);
  })
  .catch((error)=>console.error('Error: ' + error));*/
    
    fetch('https://corsproxy.io/?' + encodeURIComponent('http://spelhagenscatering.se'))
      .then((response) => response.text())
      .then((result) => {
        //Create Element
        const code = document.createElement('html');
        code.innerHTML = result;


        //Read image
      (async () => {
        const worker = await Tesseract.createWorker('swe');
        const ret = await worker.recognize(code.querySelector("#page-zones__main .bk-image.imagewidget figure a").href);
        let text = ret.data.text.split("dag").splice(1);
        text[text.length-1] = text[text.length-1].slice(0, -110);

        text = text.map(x=>x=x.slice(0, -4));
        
        
        console.log(text);

        setCookie('hemkop', JSON.stringify(text), 2)

        const lunchBlockLeft = document.createElement('div');
        lunchBlockLeft.classList.add("lunch-block");
        lunchBlockLeft.classList.add("left");

        const lunchBlockRight = document.createElement('div');
        lunchBlockRight.classList.add("lunch-block");
        lunchBlockRight.classList.add("right");



        for(i = 0; i < text.length; i++) {
          let dagar = ["MÅNDAG","TISDAG","ONSDAG","TORSDAG","FREDAG"];
          const lunchBlockPName = document.createElement('p');
          lunchBlockPName.innerHTML = `<strong>${dagar[i]}</strong><p>${text[i]}</p>`;
          if(i == currDay-1) lunchBlockPName.id = 'current-day';
          if(i <= 2) {
            lunchBlockLeft.appendChild(lunchBlockPName);
          } else {
            lunchBlockRight.appendChild(lunchBlockPName);
          }
        };

        

        lunchWrapper.appendChild(lunchBlockLeft);
        lunchWrapper.appendChild(lunchBlockRight);

        document.body.appendChild(lunchWrapper);

        //let jsonData = {"Brand":"hemkop","Luncher":[document.querySelector('.lunch-wrapper').innerHTML]}


        /*const data = new File([`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head><body>${document.body.querySelector('.lunch-wrapper').outerHTML}` + '</body></html>'], 'hemkop.html', {
          type: 'text/html'
        })

        data.text = document.body.querySelector('.lunch-wrapper').outerHTML;

        fetch('https://cors.sizable.workers.dev/https://prao.8m.se/hemkop.html', {"method":"post","body":data})
        .then((response) => response.text())
        .then((result) => console.log(result));*/
          
          

//https://prao.8m.se/instructions.html

        await worker.terminate();
      })()}).catch((error) => console.error(error));
         
} else if(restaurang == 'at') {
  fetch('https://cors.sizable.workers.dev/https://www.restaurang.at/')
      .then((response) => response.text())
      .then((result) => {
        //Create Element
        const code = document.createElement('html');
        code.innerHTML = result;
        code.querySelector('.entry-content').remove();
        code.querySelector('.woocommerce-add-lunches').remove();
        code.querySelector('.lunch-wrapper h2').classList.add('week-h2');
        document.body.appendChild(code.querySelector('.lunch-wrapper h2'));
        const flexDiv = document.createElement('div');

        

        flexDiv.classList.add('flex-container');


        //Highlight current day
        if(currDay <= 3) {
          code.querySelector(`.lunch-wrapper .left p:nth-child(${currDay*2})`).id = 'current-day';
        } else if(currDay <= 5) {
          code.querySelector(`.lunch-wrapper .right p:nth-child(${currDay*2})`).id = 'current-day';
        }

        /*for(i = 1; i < 3; i++) {
          code.querySelector(`.left p:nth-child(1)`).prepend(code.querySelector(`.left h4:nth-child(1)`))
        }*/

        code.querySelector('.right p').prepend(code.querySelector('.right h4'))


        flexDiv.appendChild(code.querySelector('.lunch-wrapper'))


        document.body.appendChild(flexDiv);
      })
} else if(restaurang == 'nsu') {
  fetch('https://cors.sizable.workers.dev/https://nsutbildning.se/restaurang/')
    .then((response) => response.text())
    .then((result) => {
      //Create Element
      const code = document.createElement('html');
      code.innerHTML = result;
      const menuPart = code.querySelector(".page-content section:nth-child(5) .row .row div .spb_wrapper");
      code.remove();
      menuPart.querySelector('h3').remove();
      menuPart.querySelector('ul').remove();
      for(i = 0; i < 10; i++) {
        menuPart.querySelector('p:last-child').remove();
      }
      menuPart.querySelector('p:first-child').remove();
      menuPart.querySelector('p:first-child').classList.add('week-h2');

      menuPart.classList.add('lunch-wrapper')
      const leftDiv = document.createElement('div');
      const rightDiv = document.createElement('div');
      leftDiv.classList.add('lunch-block');
      rightDiv.classList.add('lunch-block');
      leftDiv.classList.add('right');
      rightDiv.classList.add('left');

      let secondPart = false;
      menuPart.firstChild.classList.add('nsu-week')
      document.body.appendChild(menuPart.childNodes[0])
      for(i = 0; i < menuPart.childNodes.length-1; i++) {
        if(menuPart.childNodes[i].innerHTML.startsWith('<em>')) {
        }
        console.log(menuPart.childNodes[i].childNodes);
          let latestDay = null;
          let latestDayInt = 0;
          while (menuPart.childNodes.length > 1) {
            if(menuPart.childNodes[0].innerHTML.startsWith('<strong>')) {
              if(latestDayInt == 3) secondPart = true;
              latestDayInt++;
              latestDay = menuPart.childNodes[0];
              if(latestDayInt == currDay) latestDay.id = 'current-day';
              if(!secondPart) {
                leftDiv.appendChild(menuPart.childNodes[0]);
              } else {
                rightDiv.appendChild(menuPart.childNodes[0]);
              }
            } else {
              latestDay.appendChild(menuPart.childNodes[0]);
            }
            
          }
      menuPart.appendChild(leftDiv);
      menuPart.appendChild(rightDiv);
      menuPart.querySelector('p:first-child').remove();
      document.body.appendChild(menuPart);
    }})
}