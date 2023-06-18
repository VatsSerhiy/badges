function createBadge() {
    const fullname = document.getElementById('fullname').value;
    const date = document.getElementById('date').value;
    const end_date = document.getElementById('end_date').value;
    const course = 'baran';

    if (fullname === '') {
        alert('Введіть ПІБ');
        return;
    }

    if (course === '') {
        alert('Введіть назву курса');
        return;
    }

    if (date === '') {
        alert('Введіть дату отримання');
        return;
    }

    if (end_date === '') {
        alert('Введіть дату закінчення терміну дії');
        return;
    }

    if (date > end_date) {
        alert('Дата отримання не може бути меншою за дату закінчення дії бейджу');
        return;
    }

    const regexForName = /^([А-ЯЇІЄ]{1})([а-яїіє]{2,15})+\s([А-ЯЇІЄ]{1})([а-яїіє]{1,15})+\s([А-ЯЇІЄ]{1})([а-яїіє]{2,15})+$/;
    if (!regexForName.test(fullname)) {
        alert('ПІБ введено неправильно');
        return;
    }

    const canvasContainer = document.createElement('div');
    canvasContainer.classList.add('canvas-container');
    document.body.appendChild(canvasContainer);
    const canvas = new fabric.Canvas('canvas', {
        width: canvasContainer.clientWidth,
        height: canvasContainer.clientHeight,
    });

    canvas.setWidth(960);
    canvas.setHeight(540);

    canvasContainer.appendChild(canvas.lowerCanvasEl);

    const maxWidth = canvas.width;
    const maxHeight = canvas.height;

    fabric.Image.fromURL('images/Интерьерная компания Комфорт (1).png', function (img) {
        const scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height);
        img.scaleToWidth(img.width * scaleFactor);
        img.scaleToHeight(img.height * scaleFactor);
        canvas.add(img);

        canvas.sendToBack(img);

        const fullnameText = new fabric.Text(fullname, {
            left: 240,
            top: 240,
            fontSize: 36,
            fill: 'white'
        });
        canvas.add(fullnameText);

        const dateText = new fabric.Text('Виданий: ' + date, {
            left: 150,
            top: 408,
            fontSize: 32,
            fill: 'white'
        });
        canvas.add(dateText);

        const end_dateText = new fabric.Text('Дійсний до: ' + end_date, {
            left: 550,
            top: 408,
            fontSize: 32,
            fill: 'white'
        });
        canvas.add(end_dateText);

        const uniqueCode = new fabric.Text(generateUniqueCode(), {
            left: 30,
            top: 20,
            fontSize: 16,
            fill: 'white'
        });
        canvas.add(uniqueCode);

        canvas.renderAll();

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Завантажити';
        downloadBtn.addEventListener('click', () => {
            const url = canvas.toDataURL('image/png');

            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'myCanvas.png';

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            sendBadgeInfoToServer(uniqueCode.text, fullname, date, course, end_date);
        });

        document.body.appendChild(downloadBtn);
    });
}

function generateUniqueCode() {
    const timestamp = Date.now().toString();
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    return timestamp + randomDigits;
}

function sendBadgeInfoToServer(number, fullname, date, course, end_date) {
    const badge = {
        number: number,
        fullname: fullname,
        date: date,
        end_date: end_date,
        course: course,
    };

    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(badge)
    })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error(error);
        });
}