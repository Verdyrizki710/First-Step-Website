
// ==========================================
// 1. DATA LATIHAN
// ==========================================

const items = [
    {
        name: "Latihan 1",
        category: "Pemanasan",
        duration: "[Durasi]",
        level: "Pemula"
    },
    {
        name: "Latihan 2",
        category: "Kamar Kos",
        duration: "[Durasi]",
        level: "Pemula"
    },
    {
        name: "Latihan 3",
        category: "Sela Kuliah",
        duration: "[Durasi]",
        level: "Pemula"
    },
    {
        name: "Latihan 4",
        category: "Kardio Ringan",
        duration: "[Durasi]",
        level: "Pemula"
    },
    {
        name: "Latihan 5",
        category: "Pemanasan",
        duration: "[Durasi]",
        level: "Pemula"
    },
    {
        name: "Latihan 6",
        category: "Kamar Kos",
        duration: "[Durasi]",
        level: "Pemula"
    }
];


// ==========================================
// 2. MEMBUAT KARTU LATIHAN
// ==========================================

function card(item, index) {
    return `
        <article
            class="exercise-card dashed"
            data-card="${index}"
            tabindex="0"
            role="button"
            aria-label="Buka ${item.name}"
        >
            <div class="exercise-image">[Gambar]</div>
            <b>${item.name}</b>
            <p>${item.duration} · ${item.level}</p>
        </article>
    `;
}

// Menampilkan tiga latihan populer
document.getElementById("popularCards").innerHTML =
    items.slice(0, 3).map(card).join("");


// ==========================================
// 3. FILTER KATEGORI LATIHAN
// ==========================================

const categories = [
    "Semua",
    "Pemanasan",
    "Kamar Kos",
    "Sela Kuliah",
    "Kardio Ringan"
];

let activeCategory = "Semua";

// Membuat tombol filter
document.getElementById("filters").innerHTML =
    categories.map(category => `
        <button
            class="filter ${category === "Semua" ? "active" : ""}"
            data-filter="${category}"
        >
            ${category}
        </button>
    `).join("");

// Menampilkan latihan berdasarkan kategori
function renderTraining() {
    const filteredItems = items
        .map((item, index) => ({
            ...item,
            index
        }))
        .filter(item =>
            activeCategory === "Semua" ||
            item.category === activeCategory
        );

    document.getElementById("trainingCards").innerHTML =
        filteredItems.map(item => card(item, item.index)).join("");

    // Memperbarui tombol kategori aktif
    document.querySelectorAll(".filter").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === activeCategory
        );
    });
}

renderTraining();


// ==========================================
// 4. NAVIGASI HALAMAN
// ==========================================

function showPage(id) {
    // Menyembunyikan semua halaman
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    // Menampilkan halaman yang dipilih
    document.getElementById(id).classList.add("active");

    // Memperbarui navigasi aktif
    document.querySelectorAll("nav button").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === id
        );
    });

    // Mengembalikan posisi halaman ke atas
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    // Menjalankan animasi transisi
    document.body.classList.remove("changing");
    void document.body.offsetWidth;
    document.body.classList.add("changing");
}

// Event klik navigasi
document.querySelectorAll("nav button").forEach(button => {
    button.addEventListener("click", () => {
        cursorTap(button);
        showPage(button.dataset.page);
    });
});


// ==========================================
// 5. EVENT FILTER LATIHAN
// ==========================================

document.getElementById("filters").addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");

    if (!button) return;

    activeCategory = button.dataset.filter;

    renderTraining();
    cursorTap(button);
});


// ==========================================
// 6. DETAIL LATIHAN (MODAL)
// ==========================================

function openCard(index) {
    const item = items[index];

    document.getElementById("modalTitle").textContent =
        item.name;

    document.getElementById("modalText").textContent =
        `${item.duration} · ${item.level}. ` +
        `Kategori: ${item.category}. ` +
        "Detail gerakan dapat ditambahkan sesuai materi latihan kelompok.";

    document.getElementById("modal").classList.add("show");
}

// Membuka detail latihan ketika kartu diklik
document.addEventListener("click", event => {
    const cardElement = event.target.closest("[data-card]");

    if (cardElement) {
        cursorTap(cardElement);
        openCard(Number(cardElement.dataset.card));
    }
});

// Membuka detail latihan menggunakan keyboard
document.addEventListener("keydown", event => {
    const isActivationKey =
        event.key === "Enter" || event.key === " ";

    if (isActivationKey && event.target.matches("[data-card]")) {
        event.preventDefault();
        openCard(Number(event.target.dataset.card));
    }
});

// Menutup modal
function closeModal() {
    document.getElementById("modal").classList.remove("show");
}


// ==========================================
// 7. PROGRESS TANTANGAN 7 HARI
// ==========================================

let done = new Set([0]);

const dayWrap = document.getElementById("days");

// Membuat tombol hari 1 sampai 7
dayWrap.innerHTML = Array.from({ length: 7 }, (_, index) => `
    <button
        class="day ${index === 0 ? "done" : ""}"
        data-day="${index}"
    >
        Hari ${index + 1}
    </button>
`).join("");

// Memperbarui tampilan progress
function updateDays() {
    document.querySelectorAll("[data-day]").forEach(button => {
        const index = Number(button.dataset.day);
        const isDone = done.has(index);

        button.classList.toggle("done", isDone);
        button.textContent = `Hari ${index + 1}`;
    });

    const totalDone = done.size;
    const percentage = (totalDone / 7) * 100;

    document.getElementById("progressFill").style.width =
        percentage + "%";

    document.getElementById("progressText").textContent =
        `Progress: ${totalDone} dari 7 hari`;
}

// Event klik tombol hari
dayWrap.addEventListener("click", event => {
    const button = event.target.closest("[data-day]");

    if (!button) return;

    const index = Number(button.dataset.day);

    // Mengubah status hari
    if (done.has(index)) {
        done.delete(index);
    } else {
        done.add(index);
    }

    updateDays();
    cursorTap(button);
    notify("Progress tantangan diperbarui");
});


// ==========================================
// 8. FORMULIR KONTAK
// ==========================================

document.getElementById("contactForm").addEventListener("submit", event => {
    event.preventDefault();

    notify("Pesan berhasil disimulasikan. Tidak benar-benar terkirim.");

    event.target.reset();
});


// ==========================================
// 9. NOTIFIKASI
// ==========================================

function notify(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.tt);

    window.tt = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}


// ==========================================
// 10. EFEK KLIK
// ==========================================

function cursorTap(element) {
    // Efek klik tanpa ikon panah
}


// ==========================================
// 11. SIMULASI NAVIGASI WEBSITE
// ==========================================

const sleep = milliseconds => {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
};

document.getElementById("play").addEventListener("click", async event => {
    const button = event.currentTarget;

    button.disabled = true;
    button.textContent = "● Simulasi berjalan";

    const sequence = [
        ["home", document.querySelector('[data-page="latihan"]')],
        ["latihan", document.querySelector('[data-page="about"]')],
        ["about", document.querySelector('[data-page="contact"]')],
        ["contact", document.querySelector('[data-page="home"]')]
    ];

    // Menjalankan simulasi perpindahan halaman
    for (const [page, target] of sequence) {
        cursorTap(target);

        await sleep(750);

        showPage(page);

        await sleep(950);
    }

    button.disabled = false;
    button.textContent = "↻ Putar ulang simulasi";
});


// ==========================================
// 12. INISIALISASI WEBSITE
// ==========================================

updateDays();
