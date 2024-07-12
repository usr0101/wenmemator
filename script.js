

const canvas = new fabric.Canvas('c', {
    width: document.querySelector('.canvas').clientWidth,
    height: document.querySelector('.canvas').clientHeight,
    selection: true
});

canvas.on('object:selected', function(options) {
    if (options.target && options.target.type === 'i-text') {
        options.target.enterEditing();
        options.target.hiddenTextarea.focus();

        const obj = options.target;
        const id = obj.customId;
        updateInputFields(id, obj.text, obj.fill);
    }
});

canvas.on('text:changed', function(options) {
    if (options.target && options.target.type === 'i-text') {
        const obj = options.target;
        const id = obj.customId;
        updateInputFields(id, obj.text, obj.fill);
    }
});

// create a rect object
var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

var deleteImg = document.createElement('img');
deleteImg.src = deleteIcon;

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'black';
// fabric.Object.prototype.cornerStyle = 'circle';


function renderIcon(icon) {
    return function renderIcon(ctx, left, top, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size/2, -size/2, size, size);
    ctx.restore();
    }
}

fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -20,
    offsetX: 20,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon(deleteImg),
    cornerSize: 30
});


function deleteObject(eventData, transform) {
    var target = transform.target;
    var canvas = target.canvas;

    // Remove from Fabric.js canvas
    canvas.remove(target);
    canvas.requestRenderAll();

    // Remove associated HTML elements
    var id = target.customId;

    // Remove from HTML
    var textWrapper = document.querySelector('.textWrapper');
    var textElement = document.getElementById(id);
    if (textElement && textWrapper.contains(textElement)) {
        textWrapper.removeChild(textElement);

        // Also remove associated settings div if exists
        var settingsElement = document.querySelector(`.textSettings.${id}`);
        if (settingsElement) {
            textWrapper.removeChild(settingsElement);
        }
    }
}



let setupImage = false
function setbg(file) {



    document.querySelector('.viewAll').style.display = 'none'

    if (setupImage === true) {
        document.querySelector('p.choose').style.display = 'none'
    }

    fabric.Image.fromURL(`bgs/${file}`, function(img) {
        var scaleFactor = canvas.width / img.width;

        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: scaleFactor,
            scaleY: scaleFactor
        });

        // Set canvas height to match the height of the image
        
        canvas.setHeight(img.height * scaleFactor);
        

    });
    scrollToTop()

}


setbg('1.jpg');
setupImage = true


let currentMenu = 'TEMPLATES'


function newMenu(num) {

    document.querySelector('.option.'+currentMenu).classList.remove('active')
    document.querySelector('.option.'+num).classList.add('active')
    currentMenu = num

    if (num === 'TEMPLATES') {
        returnHTML(11, 'templates')
    }
    if (num === 'HEADS') {
        returnHTML(16, 'heads')
    }
    if (num === 'STICKERS') {
        returnHTML(28, 'stickers')
    }

}



function ranPosition() {
    return Math.floor(
        Math.random() * (200 - 50 + 1)
    ) + 50;
}


function addImage(location, file) {

    document.querySelector('p.choose').style.display = 'none'

    fabric.Image.fromURL('img/'+location+'/'+file, function(oImg) {
        oImg.scaleToWidth(150);
        oImg.scaleToHeight(150);
        oImg.set({
            left: ranPosition(), // X position
            top: ranPosition()   // Y position
        });
        canvas.add(oImg);
    });


    document.querySelector('.viewAll').style.display = 'none'
    scrollToTop()

}







function returnHTML(n, location, html) {
    let allHTML = ''

        for (let i = 1; i <= n; i++) {

            if (location === 'templates') {
                allHTML += 
                    `
                        <div class="template" onclick="setbg('${i}.jpg')">
                            <img src="bgs/${i}.jpg" alt="meme" />
                        </div>  
                    `
            }
            else {
                allHTML += 
                    `
                        <div class="template" onclick="addImage('${location}', '${i}.png')">
                            <img src="img/${location}/${i}.png" alt="meme" />
                        </div>  
                    `
            }

        }
  

    document.querySelector('.templates.'+html).innerHTML = allHTML
}

returnHTML(21, 'templates', 'templatess')
returnHTML(16, 'heads', 'heads')
returnHTML(28, 'stickers', 'stickers')
returnHTML(11, 'items', 'items')










function addText(text, options) {
    const defaults = {
        left: ranPosition(),
        top: ranPosition(),
        fontSize: 50,
        fontFamily: "Lilita One",
        fill: '#000000',
        id: '',
        borderColor: '#000',
        stroke: '#000',
        strokeWidth: 3
    };

    options = Object.assign({}, defaults, options);

    const textObj = new fabric.IText(text, {
        left: options.left,
        top: options.top,
        fontSize: options.fontSize,
        fontFamily: options.fontFamily,
        fill: options.fill,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth,
        borderColor: options.borderColor,
        editable: true
    });

    textObj.customId = options.id;

    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();

    updateInputFields(options.id, text, options.fill);
}

function updateInputFields(id, text, color) {
    const inputElem = document.querySelector(`input#${id}`);
    const colorInputElem = document.querySelector(`input.color#${id}`);

    if (inputElem) {
        inputElem.value = text;
    } else {
        console.error(`Input element with id ${id} not found.`);
    }

    if (colorInputElem) {
        colorInputElem.value = color;
    } else {
        console.error(`Color input element with id ${id} not found.`);
    }
}


// Example usage

function changeTextValueById(id, newValue) {
    canvas.forEachObject(function(obj) {
        if (obj.customId === id && obj instanceof fabric.Text) {
            obj.set('text', newValue);
            canvas.renderAll();
        }
    });
}

function changeTextPropertyById(id, property, value) {
    canvas.forEachObject(function(obj) {
        if (obj.customId === id) {
            switch (property) {
                case 'fill':
                    obj.set('fill', value);
                    break;
                case 'borderColor':
                    obj.set('stroke', value);
                    break;
                default:
                    console.error('Invalid property:', property);
                    break;
            }
            canvas.renderAll();
        }
    });
}


function deleteTextById(id) {
    // Remove from Fabric.js canvas
    canvas.forEachObject(function(obj) {
        if (obj.customId === id && obj instanceof fabric.Text) {
            canvas.remove(obj);
            canvas.renderAll();
        }
    });

    // Remove from HTML
    var textWrapper = document.querySelector('.textWrapper');
    var textElement = document.getElementById(id);
    if (textElement && textWrapper.contains(textElement)) {
        textWrapper.removeChild(textElement);
    }
}


let textNum = 1

function setupText() {
    const currentID = `text${textNum}`;
    const textWrapper = document.querySelector('.textWrapper');

    const mainDiv = createMainDiv(currentID);
    const mainDivInput = createMainDivInput(currentID);
    const textSettings = createTextSettings(currentID);

    mainDiv.appendChild(mainDivInput);
    mainDiv.appendChild(textSettings);
    textWrapper.append(mainDiv);

    addText('WEN', { fill: '#ffffff', id: currentID });

    addEventListeners(currentID);

    textNum++;
}

function createMainDiv(id) {
    const div = document.createElement('div');
    div.classList = 'text';
    div.id = id;
    return div;
}

function createMainDivInput(id) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'text';
    input.id = id;
    return input;
}

function createTextSettings(id) {
    const settingsDiv = document.createElement('div');
    settingsDiv.classList = `textSettings ${id}`;
    settingsDiv.id = id;

    const colorDiv = createColorDiv(id);
    const deleteDiv = createDeleteDiv(id);

    settingsDiv.appendChild(colorDiv);
    settingsDiv.appendChild(deleteDiv);

    return settingsDiv;
}

function createColorDiv(id) {
    const colorDiv = document.createElement('div');
    colorDiv.classList = 'color';
    colorDiv.id = id;

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.classList = 'color';
    colorInput.id = id;

    colorDiv.appendChild(colorInput);
    return colorDiv;
}

function createDeleteDiv(id) {
    const deleteDiv = document.createElement('div');
    deleteDiv.classList = 'delete';
    deleteDiv.id = id;
    deleteDiv.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    return deleteDiv;
}

function addEventListeners(id) {
    document.querySelector(`input#${id}`).addEventListener('input', function(e) {
        changeTextValueById(id, e.target.value);
    });

    document.querySelector(`input.color#${id}`).addEventListener('change', function(e) {
        changeTextPropertyById(e.target.id, 'fill', e.target.value);
        document.querySelector(`.textSettings#${e.target.id} div.color`).style.backgroundColor = e.target.value;
    });

    document.querySelector(`.textSettings.${id} div.delete`).addEventListener('click', function(e) {
        deleteTextById(e.target.id);
    });
}



document.getElementById('imageFile').addEventListener("change", function (e) {
    document.querySelector('p.choose').style.display = 'none'
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (f) {
        var data = f.target.result;

        fabric.Image.fromURL(data, function (img) {

            var scaleFactor = canvas.width / img.width; // Adjust based on width

            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: scaleFactor,
                scaleY: scaleFactor
            });

            canvas.setHeight(img.height * scaleFactor);

        });
    };
    reader.readAsDataURL(file);

});






function openAll(things, amount) {


    let storedHTML = ''

    for (let i = 1; i <= amount; i++) {
        if (things === 'templates') {
            storedHTML += 
                `
                    <div class="temp" onclick="setbg('${i}.jpg')">
                        <img src="bgs/${i}.jpg" alt="">
                    </div>
                `
        }
        else {
            storedHTML += 
                `
                    <div class="template" 
                        <img src="img/${location}/${i}.png" alt="meme" />
                    </div>  
        
                    <div class="temp" onclick="addImage('${things}', '${i}.png')">
                        <img src="img/${things}/${i}.png" alt="">
                    </div>
                `
        }
    }
    document.querySelector('.temps').innerHTML = storedHTML
    document.querySelector('.viewAll').style.display = 'flex'

}



function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' 
    });
}




const saveCanvas = () => {
    
    const ext = "png";
    const base64 = canvas.toDataURL({
    format: ext,
    enableRetinaScaling: true
    });
    const link = document.createElement("a");
    link.href = base64;
    link.download = `wenwenwen.${ext}`;
    link.click();
}

const getImage = () => {
    
    const ext = "png";
    const base64 = canvas.toDataURL({
    format: ext,
    enableRetinaScaling: true
    });
    
    return base64
}


function startDownload() {

    document.querySelector('.preview').style.display = 'flex'
    document.querySelector('img.prevBtn').src = getImage()

}

function back() {
    document.querySelector('.preview').style.display = 'none'
}



function exitViewAll() {
    document.querySelector('.viewAll').style.display = 'none'
}
