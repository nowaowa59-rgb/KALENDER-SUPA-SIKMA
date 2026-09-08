/* =========================================
   CALENDAR INDONESIA
   HTML + CSS + JAVASCRIPT
========================================= */


/* =========================================
   1. ELEMENT HTML
========================================= */

const calendarDays =
    document.getElementById("calendarDays");

const monthTitle =
    document.getElementById("monthTitle");

const yearSelect =
    document.getElementById("yearSelect");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

const todayBtn =
    document.getElementById("todayBtn");

const themeBtn =
    document.getElementById("themeBtn");

const searchInput =
    document.getElementById("searchInput");

const holidayList =
    document.getElementById("holidayList");

const holidayCount =
    document.getElementById("holidayCount");

const weekendCount =
    document.getElementById("weekendCount");

const daysInMonth =
    document.getElementById("daysInMonth");

const loading =
    document.getElementById("loading");

const lastUpdated =
    document.getElementById("lastUpdated");

const addEventBtn =
    document.getElementById("addEventBtn");

const eventModal =
    document.getElementById("eventModal");

const closeModal =
    document.getElementById("closeModal");

const closeDateModal =
    document.getElementById("closeDateModal");

const dateModal =
    document.getElementById("dateModal");

const eventForm =
    document.getElementById("eventForm");

const dateDetailContent =
    document.getElementById("dateDetailContent");



/* =========================================
   2. DATA DASAR
========================================= */

const monthNames = [
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


const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu"
];



/* =========================================
   3. TANGGAL SEKARANG
========================================= */

const today = new Date();

let currentMonth = today.getMonth();

let currentYear = today.getFullYear();



/* =========================================
   4. DATA HARI LIBUR
========================================= */

let holidays = [];

let events =
    JSON.parse(
        localStorage.getItem("calendarEvents")
    ) || [];



/* =========================================
   5. BUAT PILIHAN TAHUN
========================================= */

function createYearOptions() {

    yearSelect.innerHTML = "";

    for (
        let year = currentYear - 10;
        year <= currentYear + 10;
        year++
    ) {

        const option =
            document.createElement("option");

        option.value = year;

        option.textContent = year;

        if (year === currentYear) {
            option.selected = true;
        }

        yearSelect.appendChild(option);
    }
}



/* =========================================
   6. MENGAMBIL DATA HARI LIBUR API
========================================= */

async function fetchHolidays(year) {

    loading.classList.remove("hidden");

    try {

        const response = await fetch(
            `https://date.nager.at/api/v3/PublicHolidays/${year}/ID`
        );

        if (!response.ok) {
            throw new Error(
                "Gagal mengambil data API"
            );
        }

        holidays = await response.json();

        lastUpdated.textContent =
            "Data libur berhasil diperbarui";

    } catch (error) {

        console.error(error);

        holidays = [];

        lastUpdated.textContent =
            "Data libur API tidak tersedia";

    }

    loading.classList.add("hidden");

    renderCalendar();
}



/* =========================================
   7. FORMAT TANGGAL
========================================= */

function formatDate(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}



/* =========================================
   8. CEK HARI LIBUR
========================================= */

function getHoliday(dateString) {

    return holidays.find(
        holiday =>
            holiday.date === dateString
    );
}



/* =========================================
   9. CEK EVENT
========================================= */

function getEvents(dateString) {

    return events.filter(
        event =>
            event.date === dateString
    );
}



/* =========================================
   10. MEMBUAT KALENDER
========================================= */

function renderCalendar() {

    calendarDays.innerHTML = "";

    monthTitle.textContent =
        monthNames[currentMonth];

    yearSelect.value =
        currentYear;


    /* Hari pertama bulan */

    const firstDay =
        new Date(
            currentYear,
            currentMonth,
            1
        );


    /* Jumlah hari */

    const totalDays =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();


    /* Hari terakhir bulan sebelumnya */

    const previousMonthLastDay =
        new Date(
            currentYear,
            currentMonth,
            0
        ).getDate();


    /*
       JavaScript:

       Minggu = 0
       Senin  = 1
       Selasa = 2
       ...
    */

    let startingDay =
        firstDay.getDay();


    /*
       Kalender kita dimulai Senin.

       Jika Minggu (0),
       ubah menjadi 6.
    */

    startingDay =
        startingDay === 0
            ? 6
            : startingDay - 1;


    let totalWeekend = 0;

    let totalHoliday = 0;


    /* =====================================
       HARI BULAN SEBELUMNYA
    ===================================== */

    for (
        let i = startingDay - 1;
        i >= 0;
        i--
    ) {

        const day =
            previousMonthLastDay - i;

        const cell =
            createDayElement(
                day,
                currentMonth - 1,
                currentYear,
                true
            );

        calendarDays.appendChild(cell);
    }


    /* =====================================
       HARI BULAN SEKARANG
    ===================================== */

    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const date =
            new Date(
                currentYear,
                currentMonth,
                day
            );

        const dayOfWeek =
            date.getDay();

        if (
            dayOfWeek === 0 ||
            dayOfWeek === 6
        ) {
            totalWeekend++;
        }


        const dateString =
            formatDate(date);

        const holiday =
            getHoliday(dateString);

        if (holiday) {
            totalHoliday++;
        }


        const cell =
            createDayElement(
                day,
                currentMonth,
                currentYear,
                false
            );

        calendarDays.appendChild(cell);
    }


    /* =====================================
       HARI BULAN BERIKUTNYA
    ===================================== */

    const totalCells =
        calendarDays.children.length;

    const remainingCells =
        42 - totalCells;

    for (
        let day = 1;
        day <= remainingCells;
        day++
    ) {

        const cell =
            createDayElement(
                day,
                currentMonth + 1,
                currentYear,
                true
            );

        calendarDays.appendChild(cell);
    }


    /* Statistik */

    daysInMonth.textContent =
        totalDays;

    weekendCount.textContent =
        totalWeekend;

    holidayCount.textContent =
        totalHoliday;


    renderHolidayList();

    renderEventList();
}



/* =========================================
   11. MEMBUAT CELL HARI
========================================= */

function createDayElement(
    day,
    month,
    year,
    isOtherMonth
) {

    const cell =
        document.createElement("div");

    cell.classList.add("day");


    const date =
        new Date(
            year,
            month,
            day
        );


    const dateString =
        formatDate(date);


    /* Nomor hari */

    const number =
        document.createElement("div");

    number.className =
        "day-number";

    number.textContent =
        date.getDate();

    cell.appendChild(number);


    /* =====================================
       OTHER MONTH
    ===================================== */

    if (isOtherMonth) {

        cell.classList.add(
            "other-month"
        );
    }


    /* =====================================
       WEEKEND
    ===================================== */

    const dayOfWeek =
        date.getDay();

    if (
        dayOfWeek === 0 ||
        dayOfWeek === 6
    ) {

        cell.classList.add(
            "weekend"
        );
    }


    /* =====================================
       TODAY
    ===================================== */

    if (
        dateString ===
        formatDate(today)
    ) {

        cell.classList.add(
            "today"
        );
    }


    /* =====================================
       HOLIDAY
    ===================================== */

    const holiday =
        getHoliday(dateString);

    if (holiday) {

        cell.classList.add(
            "holiday"
        );


        const holidayName =
            document.createElement("div");

        holidayName.className =
            "holiday-name";

        holidayName.textContent =
            holiday.localName ||
            holiday.name;

        cell.appendChild(
            holidayName
        );
    }


    /* =====================================
       EVENT
    ===================================== */

    const dayEvents =
        getEvents(dateString);

    if (dayEvents.length > 0) {

        const eventIndicator =
            document.createElement("div");

        eventIndicator.className =
            "event-indicator";

        cell.appendChild(
            eventIndicator
        );
    }


    /* =====================================
       CLICK
    ===================================== */

    cell.addEventListener(
        "click",
        () => {

            showDateDetail(
                date
            );

        }
    );


    return cell;
}



/* =========================================
   12. LIST HARI LIBUR
========================================= */

function renderHolidayList() {

    holidayList.innerHTML = "";


    const monthHolidays =
        holidays.filter(
            holiday => {

                const date =
                    new Date(
                        holiday.date
                    );

                return (
                    date.getMonth() ===
                    currentMonth
                );
            }
        );


    if (
        monthHolidays.length === 0
    ) {

        holidayList.innerHTML = `
            <p class="empty-text">
                Tidak ada hari libur
                yang ditemukan bulan ini.
            </p>
        `;

        return;
    }


    monthHolidays.forEach(
        holiday => {

            const date =
                new Date(
                    holiday.date
                );


            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "holiday-item";


            item.innerHTML = `

                <div class="holiday-date">
                    ${date.getDate()}
                    ${monthNames[
                        date.getMonth()
                    ].substring(0, 3)}
                </div>

                <div class="holiday-info">

                    <strong>
                        ${
                            holiday.localName ||
                            holiday.name
                        }
                    </strong>

                    <small>
                        ${dayNames[
                            date.getDay()
                        ]}
                    </small>

                </div>
            `;


            holidayList.appendChild(
                item
            );
        }
    );
}



/* =========================================
   13. EVENT LIST
========================================= */

function renderEventList() {

    eventList.innerHTML = "";


    const monthEvents =
        events.filter(
            event => {

                const date =
                    new Date(
                        event.date
                    );

                return (
                    date.getMonth() ===
                    currentMonth &&
                    date.getFullYear() ===
                    currentYear
                );
            }
        );


    if (
        monthEvents.length === 0
    ) {

        eventList.innerHTML = `
            <p class="empty-text">
                Belum ada event.
            </p>
        `;

        return;
    }


    monthEvents.forEach(
        event => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "event-item";


            item.innerHTML = `

                <strong>
                    ${event.title}
                </strong>

                <small>
                    ${event.date}
                </small>

            `;


            eventList.appendChild(
                item
            );
        }
    );
}



/* =========================================
   14. DETAIL TANGGAL
========================================= */

function showDateDetail(date) {

    const dateString =
        formatDate(date);

    const holiday =
        getHoliday(dateString);

    const dayEvents =
        getEvents(dateString);


    let html = `

        <h2>
            ${date.getDate()}
            ${monthNames[
                date.getMonth()
            ]}
            ${date.getFullYear()}
        </h2>

        <p class="detail-date">
            ${dayNames[
                date.getDay()
            ]}
        </p>

    `;


    if (holiday) {

        html += `

            <div class="detail-holiday">

                🎉 ${
                    holiday.localName ||
                    holiday.name
                }

            </div>

        `;

    } else {

        html += `

            <div class="detail-normal">

                Tidak ada hari libur
                pada tanggal ini.

            </div>

        `;
    }


    if (dayEvents.length > 0) {

        html += `

            <div style="margin-top:15px">

                <strong>
                    📝 Event
                </strong>

                <br>

                ${dayEvents
                    .map(
                        event =>
                            `<p>
                                ${event.title}
                            </p>`
                    )
                    .join("")
                }

            </div>
        `;
    }


    dateDetailContent.innerHTML =
        html;

    dateModal.classList.remove(
        "hidden"
    );
}



/* =========================================
   15. EVENT MODAL
========================================= */

addEventBtn.addEventListener(
    "click",
    () => {

        eventModal.classList.remove(
            "hidden"
        );

    }
);


closeModal.addEventListener(
    "click",
    () => {

        eventModal.classList.add(
            "hidden"
        );

    }
);


closeDateModal.addEventListener(
    "click",
    () => {

        dateModal.classList.add(
            "hidden"
        );

    }
);



/* =========================================
   16. SIMPAN EVENT
========================================= */

eventForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const title =
            document.getElementById(
                "eventTitle"
            ).value;


        const date =
            document.getElementById(
                "eventDate"
            ).value;


        const description =
            document.getElementById(
                "eventDescription"
            ).value;


        const newEvent = {

            id: Date.now(),

            title: title,

            date: date,

            description: description

        };


        events.push(
            newEvent
        );


        localStorage.setItem(
            "calendarEvents",
            JSON.stringify(events)
        );


        eventForm.reset();

        eventModal.classList.add(
            "hidden"
        );


        renderCalendar();
    }
);



/* =========================================
   17. BULAN SEBELUMNYA
========================================= */

prevBtn.addEventListener(
    "click",
    () => {

        currentMonth--;

        if (currentMonth < 0) {

            currentMonth = 11;

            currentYear--;

            createYearOptions();

            fetchHolidays(
                currentYear
            );

        } else {

            renderCalendar();

        }
    }
);



/* =========================================
   18. BULAN BERIKUTNYA
========================================= */

nextBtn.addEventListener(
    "click",
    () => {

        currentMonth++;

        if (currentMonth > 11) {

            currentMonth = 0;

            currentYear++;

            createYearOptions();

            fetchHolidays(
                currentYear
            );

        } else {

            renderCalendar();

        }
    }
);



/* =========================================
   19. PILIH TAHUN
========================================= */

yearSelect.addEventListener(
    "change",
    () => {

        currentYear =
            Number(
                yearSelect.value
            );

        fetchHolidays(
            currentYear
        );
    }
);



/* =========================================
   20. TOMBOL HARI INI
========================================= */

todayBtn.addEventListener(
    "click",
    () => {

        currentMonth =
            today.getMonth();

        currentYear =
            today.getFullYear();

        createYearOptions();

        fetchHolidays(
            currentYear
        );
    }
);



/* =========================================
   21. DARK MODE
========================================= */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "darkMode",
            isDark
        );


        themeBtn.textContent =
            isDark
                ? "☀️"
                : "🌙";
    }
);



/* =========================================
   22. LOAD DARK MODE
========================================= */

function loadTheme() {

    const darkMode =
        localStorage.getItem(
            "darkMode"
        );


    if (darkMode === "true") {

        document.body.classList.add(
            "dark"
        );

        themeBtn.textContent =
            "☀️";
    }
}



/* =========================================
   23. SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    () => {

        const keyword =
            searchInput.value
                .toLowerCase()
                .trim();


        const days =
            document.querySelectorAll(
                ".day"
            );


        days.forEach(
            day => {

                if (
                    keyword === ""
                ) {

                    day.style.opacity =
                        "1";

                    return;
                }


                const text =
                    day.textContent
                        .toLowerCase();


                if (
                    text.includes(keyword)
                ) {

                    day.style.opacity =
                        "1";

                    day.style.transform =
                        "scale(1.03)";

                } else {

                    day.style.opacity =
                        "0.25";

                    day.style.transform =
                        "scale(1)";
                }
            }
        );
    }
);



/* =========================================
   24. KEYBOARD NAVIGATION
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "ArrowLeft"
        ) {

            prevBtn.click();

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            nextBtn.click();

        }


        if (
            event.key ===
            "Escape"
        ) {

            eventModal.classList.add(
                "hidden"
            );

            dateModal.classList.add(
                "hidden"
            );
        }
    }
);



/* =========================================
   25. TUTUP MODAL KETIKA KLIK LUAR
========================================= */

window.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            eventModal
        ) {

            eventModal.classList.add(
                "hidden"
            );
        }


        if (
            event.target ===
            dateModal
        ) {

            dateModal.classList.add(
                "hidden"
            );
        }
    }
);



/* =========================================
   26. START APPLICATION
========================================= */

function init() {

    createYearOptions();

    loadTheme();

    fetchHolidays(
        currentYear
    );

}


init();