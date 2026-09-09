/* =========================
   AERODER CALENDAR
========================= */


/* =========================
   ELEMENTS
========================= */

const calendar =
    document.getElementById("calendar");

const monthName =
    document.getElementById("monthName");

const yearNumber =
    document.getElementById("yearNumber");

const previousMonth =
    document.getElementById("previousMonth");

const nextMonth =
    document.getElementById("nextMonth");

const todayButton =
    document.getElementById("todayButton");

const yearSelect =
    document.getElementById("yearSelect");

const eventModal =
    document.getElementById("eventModal");

const closeModal =
    document.getElementById("closeModal");

const modalDate =
    document.getElementById("modalDate");

const modalStatus =
    document.getElementById("modalStatus");

const eventInput =
    document.getElementById("eventInput");

const saveEvent =
    document.getElementById("saveEvent");

const existingEvent =
    document.getElementById("existingEvent");

const themeButton =
    document.getElementById("themeButton");

const musicButton =
    document.getElementById("musicButton");

const musicToggle =
    document.getElementById("musicToggle");

const musicStatus =
    document.querySelector(".music-status");

const backgroundMusic =
    document.getElementById("backgroundMusic");

const musicPanel =
    document.getElementById("musicPanel");


/* =========================
   MONTH NAMES
========================= */

const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
];


/* =========================
   IMPORTANT DAYS
========================= */

const importantDays = {

    "1-1":
        "Tahun Baru",

    "2-1":
        "Hari Kesaktian Pancasila",

    "17-8":
        "Hari Kemerdekaan RI",

    "28-10":
        "Hari Sumpah Pemuda",

    "10-11":
        "Hari Pahlawan",

    "25-12":
        "Hari Natal"

};


/* =========================
   DATE
========================= */

const currentDate =
    new Date();

let currentMonth =
    currentDate.getMonth();

let currentYear =
    currentDate.getFullYear();

let selectedDate =
    null;


/* =========================
   EVENTS
========================= */

let events =
    JSON.parse(
        localStorage.getItem(
            "aeroderEvents"
        )
    ) || {};


/* =========================
   INITIALIZE YEAR
========================= */

function createYearOptions() {

    yearSelect.innerHTML = "";

    for (
        let year = currentYear - 10;
        year <= currentYear + 10;
        year++
    ) {

        const option =
            document.createElement(
                "option"
            );

        option.value = year;

        option.textContent =
            year;

        yearSelect.appendChild(
            option
        );
    }

    yearSelect.value =
        currentYear;
}


/* =========================
   RENDER CALENDAR
========================= */

function renderCalendar() {

    calendar.innerHTML = "";

    monthName.textContent =
        months[currentMonth];

    yearNumber.textContent =
        currentYear;

    yearSelect.value =
        currentYear;


    /*
        Tanggal pertama bulan
    */

    const firstDay =
        new Date(
            currentYear,
            currentMonth,
            1
        );


    /*
        Hari terakhir bulan
    */

    const lastDay =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        );


    const firstWeekday =
        firstDay.getDay();

    const totalDays =
        lastDay.getDate();


    /*
        Membuat kotak kosong
        sebelum tanggal 1
    */

    for (
        let i = 0;
        i < firstWeekday;
        i++
    ) {

        const emptyDay =
            document.createElement(
                "div"
            );

        emptyDay.classList.add(
            "day",
            "empty"
        );

        calendar.appendChild(
            emptyDay
        );
    }


    /*
        Membuat tanggal
    */

    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        createDay(
            day
        );
    }

}


/* =========================
   CREATE DAY
========================= */

function createDay(day) {

    const date =
        new Date(
            currentYear,
            currentMonth,
            day
        );


    const weekday =
        date.getDay();


    const dayElement =
        document.createElement(
            "div"
        );


    dayElement.classList.add(
        "day"
    );


    /*
        Sabtu = 6
        Minggu = 0

        Jadi keduanya libur.
    */

    if (
        weekday === 0 ||
        weekday === 6
    ) {

        dayElement.classList.add(
            "weekend"
        );

    }


    /*
        Cek apakah hari ini
    */

    if (
        day === currentDate.getDate() &&
        currentMonth === currentDate.getMonth() &&
        currentYear === currentDate.getFullYear()
    ) {

        dayElement.classList.add(
            "today"
        );

    }


    /*
        Cek hari penting
    */

    const importantKey =
        `${day}-${currentMonth + 1}`;

    const importantName =
        importantDays[
            importantKey
        ];


    if (importantName) {

        dayElement.classList.add(
            "important"
        );

    }


    /*
        Nomor tanggal
    */

    const number =
        document.createElement(
            "div"
        );

    number.classList.add(
        "day-number"
    );

    number.textContent =
        day;


    dayElement.appendChild(
        number
    );


    /*
        Dekorasi hari penting
    */

    if (importantName) {

        const decoration =
            document.createElement(
                "div"
            );

        decoration.classList.add(
            "day-decoration"
        );

        dayElement.appendChild(
            decoration
        );

    }


    /*
        Nama hari penting
    */

    if (importantName) {

        const holiday =
            document.createElement(
                "div"
            );

        holiday.classList.add(
            "holiday-name"
        );

        holiday.textContent =
            importantName;

        dayElement.appendChild(
            holiday
        );

    }


    /*
        EVENT USER
    */

    const dateKey =
        makeDateKey(
            currentYear,
            currentMonth,
            day
        );


    if (events[dateKey]) {

        const eventName =
            document.createElement(
                "div"
            );

        eventName.classList.add(
            "event-name"
        );

        eventName.textContent =
            "✨ " +
            events[dateKey];

        dayElement.appendChild(
            eventName
        );

    }


    /*
        Klik tanggal
    */

    dayElement.addEventListener(
        "click",
        () => {

            openEventModal(
                currentYear,
                currentMonth,
                day
            );

        }
    );


    calendar.appendChild(
        dayElement
    );
}


/* =========================
   DATE KEY
========================= */

function makeDateKey(
    year,
    month,
    day
) {

    return `${year}-${month + 1}-${day}`;

}


/* =========================
   OPEN EVENT MODAL
========================= */

function openEventModal(
    year,
    month,
    day
) {

    selectedDate =
        makeDateKey(
            year,
            month,
            day
        );


    const date =
        new Date(
            year,
            month,
            day
        );


    const formattedDate =
        date.toLocaleDateString(
            "id-ID",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    modalDate.textContent =
        formattedDate;


    /*
        Status tanggal
    */

    if (
        date.getDay() === 0 ||
        date.getDay() === 6
    ) {

        modalStatus.textContent =
            "🌴 Hari ini adalah LIBUR karena weekend.";

    } else {

        modalStatus.textContent =
            "🌱 Hari biasa. Kamu bisa menambahkan event.";

    }


    /*
        Hari penting
    */

    const importantKey =
        `${day}-${month + 1}`;

    const importantName =
        importantDays[
            importantKey
        ];


    if (importantName) {

        modalStatus.textContent +=
            ` ⭐ ${importantName}`;

    }


    eventInput.value =
        events[selectedDate] || "";


    showExistingEvent();


    eventModal.classList.add(
        "show"
    );


    setTimeout(
        () => {

            eventInput.focus();

        },
        200
    );
}


/* =========================
   EXISTING EVENT
========================= */

function showExistingEvent() {

    existingEvent.innerHTML = "";


    if (!events[selectedDate]) {

        return;

    }


    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.classList.add(
        "existing-event-item"
    );


    const text =
        document.createElement(
            "span"
        );

    text.textContent =
        "✨ " +
        events[selectedDate];


    const deleteButton =
        document.createElement(
            "button"
        );

    deleteButton.classList.add(
        "delete-event"
    );

    deleteButton.textContent =
        "Hapus";


    deleteButton.addEventListener(
        "click",
        deleteEvent
    );


    wrapper.appendChild(
        text
    );

    wrapper.appendChild(
        deleteButton
    );


    existingEvent.appendChild(
        wrapper
    );
}


/* =========================
   SAVE EVENT
========================= */

saveEvent.addEventListener(
    "click",
    saveEventData
);


eventInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            saveEventData();

        }

    }
);


function saveEventData() {

    const value =
        eventInput.value.trim();


    /*
        Kalau input kosong
    */

    if (!value) {

        delete events[selectedDate];

    } else {

        events[selectedDate] =
            value;

    }


    /*
        Simpan ke browser
    */

    localStorage.setItem(
        "aeroderEvents",
        JSON.stringify(events)
    );


    renderCalendar();

    showExistingEvent();

    eventInput.value =
        events[selectedDate] || "";
}


/* =========================
   DELETE EVENT
========================= */

function deleteEvent() {

    delete events[selectedDate];


    localStorage.setItem(
        "aeroderEvents",
        JSON.stringify(events)
    );


    renderCalendar();

    showExistingEvent();

    eventInput.value = "";
}


/* =========================
   CLOSE MODAL
========================= */

closeModal.addEventListener(
    "click",
    () => {

        eventModal.classList.remove(
            "show"
        );

    }
);


eventModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            eventModal
        ) {

            eventModal.classList.remove(
                "show"
            );

        }

    }
);


/* =========================
   PREVIOUS MONTH
========================= */

previousMonth.addEventListener(
    "click",
    () => {

        currentMonth--;

        if (
            currentMonth < 0
        ) {

            currentMonth = 11;

            currentYear--;

        }

        renderCalendar();

    }
);


/* =========================
   NEXT MONTH
========================= */

nextMonth.addEventListener(
    "click",
    () => {

        currentMonth++;

        if (
            currentMonth > 11
        ) {

            currentMonth = 0;

            currentYear++;

        }

        renderCalendar();

    }
);


/* =========================
   TODAY BUTTON
========================= */

todayButton.addEventListener(
    "click",
    () => {

        currentMonth =
            currentDate.getMonth();

        currentYear =
            currentDate.getFullYear();

        renderCalendar();

    }
);


/* =========================
   YEAR SELECT
========================= */

yearSelect.addEventListener(
    "change",
    () => {

        currentYear =
            Number(
                yearSelect.value
            );

        renderCalendar();

    }
);


/* =========================
   DARK MODE
========================= */

themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        const dark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "aeroderDarkMode",
            dark
        );


        themeButton.textContent =
            dark
                ? "☀️"
                : "🌙";

    }
);


/*
    Ambil mode sebelumnya
*/

const savedDarkMode =
    localStorage.getItem(
        "aeroderDarkMode"
    );


if (
    savedDarkMode === "true"
) {

    document.body.classList.add(
        "dark"
    );

    themeButton.textContent =
        "☀️";

}


/* =========================
   MUSIC
========================= */

let musicEnabled = false;


/*
    Tombol Music pada navbar
*/

musicButton.addEventListener(
    "click",
    () => {

        musicEnabled =
            !musicEnabled;


        if (musicEnabled) {

            playMusic();

        } else {

            stopMusic();

        }

    }
);


/*
    Tombol Play / Pause
*/

musicToggle.addEventListener(
    "click",
    () => {

        if (
            backgroundMusic.paused
        ) {

            playMusic();

        } else {

            stopMusic();

        }

    }
);


/*
    PLAY MUSIC
*/

function playMusic() {

    backgroundMusic
        .play()
        .then(
            () => {

                musicEnabled =
                    true;

                musicPanel.classList.add(
                    "playing"
                );

                musicToggle.textContent =
                    "⏸ Pause";

                musicStatus.textContent =
                    "Music ON";

            }
        )
}


/*
    STOP MUSIC
*/

function stopMusic() {

    backgroundMusic.pause();

    musicEnabled =
        false;

    musicPanel.classList.remove(
        "playing"
    );

    musicToggle.textContent =
        "▶ Play";

    musicStatus.textContent =
        "Music OFF";

}


/* =========================
   START
========================= */

createYearOptions();

renderCalendar();