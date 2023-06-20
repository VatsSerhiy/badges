function createBadge() {
    const fullname = document.getElementById('fullname').value;
    const date = document.getElementById('date').value;
    const end_date = document.getElementById('end_date').value;
    const course = document.getElementById('course').value;

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

    // if (end_date === '') {
    //     alert('Введіть дату закінчення терміну дії');
    //     return;
    // }
    //
    // if (date > end_date) {
    //     alert('Дата отримання не може бути меншою за дату закінчення дії бейджу');
    //     return;
    // }

    const regexForName = /^([А-ЯЇІЄ]{1})([а-яїіє]{2,15})+\s([А-ЯЇІЄ]{1})([а-яїіє]{1,15})+\s([А-ЯЇІЄ]{1})([а-яїіє]{2,15})+$/;
    if (!regexForName.test(fullname)) {
        alert('ПІБ введено неправильно');
        return;
    }

    const
        badge = document.querySelector('.badge'),
        badgeId = document.querySelector('.badge__id'),
        badgeTitle = document.querySelector('.badge__title'),
        badgeDesc = document.querySelector('.badge__desc'),
        badgeCreateDate = document.querySelector('.badge__create-date'),
        badgeCancelDate = document.querySelector('.badge__cancel-date'),
        saveBtn = document.querySelector('.badge .save');

    const id = generateUniqueCode();


    badgeId.textContent = `Ідентифікатор: ${id}`;
    badgeTitle.textContent = fullname;
    badgeDesc.textContent = course;
    badgeCreateDate.textContent = `Дата видачі: ${date}`;
    badgeCancelDate.textContent = end_date ? `Дійсний до: ${end_date}` : '';

    badge.classList.add('visible');

    domtoimage.toPng(badge, {
        quality: 1,
        width: badge.offsetWidth,
        height: badge.offsetHeight
    })
        .then(function(dataUrl) {
            sendBadgeInfoToServer(id, dataUrl);
            saveBtn.href = dataUrl;
            saveBtn.download = `${id}.png`;
        })
        .catch(function(error) {
            // Обробка помилки
        });
}

function generateUniqueCode() {
    const timestamp = Date.now().toString();
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    return timestamp + randomDigits;
}

function sendBadgeInfoToServer(id, img) {
    const preview = document.querySelector('.badge .preview');
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id, img})
    })
        .then(response => response.json())
        .then(response => {
            const {image} = response;
            preview.href = `/${image}`;
        })
        .catch(error => {
            console.error(error);
        });
}