
/* ========================================
   1. DATA PROYEK
======================================== */
let projects = [
    {
        id: 1,
        title: "Sistem Konversi File Dokumen, Gambar, Suara, dan Video",
        category: "Web App",
        budget: 2500000,
        completed: true
    },
    {
        id: 2,
        title: "Sistem Manajemen Gudang Elektronik",
        category: "Web App",
        budget: 5000000,
        completed: false
    }
];

/* ========================================
   2. ELEMEN HTML
======================================== */
const projectForm = document.getElementById("project-form");
const titleInput = document.getElementById("judul");
const categoryInput = document.getElementById("kategori");
const budgetInput = document.getElementById("anggaran");
const completedInput = document.getElementById("selesai");
const searchInput = document.getElementById("search-proyek");
const projectList = document.getElementById("project-list");

/* ========================================
   3. FORMAT RUPIAH
======================================== */
function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}

/* ========================================
   4. IKON KATEGORI
======================================== */
function getCategoryIcon(category) {
    const icons = {
        "Web App": "⌘",
        "Mobile App": "▣",
        "Desktop App": "▤",
        "UI/UX Design": "✳"
    };

    return icons[category] || "✦";
}

/* ========================================
   5. STATISTIK
======================================== */
function renderStatistics() {
    const total = projects.length;

    const selesai = projects.filter(
        project => project.completed
    ).length;

    const berjalan = projects.filter(
        project => !project.completed
    ).length;

    const totalAnggaran = projects.reduce(
        (total, project) => total + project.budget,
        0
    );

    document.getElementById("total-proyek").textContent = total;
    document.getElementById("proyek-berjalan").textContent = berjalan;
    document.getElementById("proyek-selesai").textContent = selesai;
    document.getElementById("total-anggaran").textContent =
        formatRupiah(totalAnggaran);
}

/* ========================================
   6. RENDER KARTU PROYEK
======================================== */
function renderProjects() {
    const keyword = searchInput.value.toLowerCase().trim();

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(keyword)
    );

    projectList.innerHTML = "";

    filteredProjects.forEach(project => {
        const card = document.createElement("article");
        card.className = "project-card";

        // Bagian ikon dan kategori
        const categoryHeader = document.createElement("div");
        categoryHeader.className = "project-category";

        const categoryIcon = document.createElement("span");
        categoryIcon.className = "project-category-icon";
        categoryIcon.textContent = getCategoryIcon(project.category);

        const categoryName = document.createElement("span");
        categoryName.className = "project-category-name";
        categoryName.textContent = project.category;

        categoryHeader.append(categoryIcon, categoryName);

        // Judul proyek
        const title = document.createElement("h3");
        title.textContent = project.title;

        // Anggaran
        const budget = document.createElement("p");
        budget.className = "project-budget";
        budget.textContent = "Estimasi anggaran: " +
            formatRupiah(project.budget);

        // Status
        const status = document.createElement("p");
        status.className = project.completed
            ? "status selesai"
            : "status berjalan";

        status.textContent = project.completed
            ? "✓  Selesai"
            : "◷  Dalam Pengerjaan";

        // Pembungkus tombol
        const actions = document.createElement("div");
        actions.className = "project-actions";

        // Tombol ubah status
        const toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.className = "status-button";
        toggleButton.textContent = project.completed
            ? "Buka Kembali ↗"
            : "Tandai Selesai ✓";

        toggleButton.addEventListener("click", function () {
            toggleStatus(project.id);
        });

        // Tombol hapus
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "hapus-button";
        deleteButton.textContent = "Hapus";

        deleteButton.addEventListener("click", function () {
            const confirmed = window.confirm(
                `Yakin ingin menghapus proyek "${project.title}"?`
            );

            if (confirmed) {
                deleteProject(project.id);
            }
        });

        actions.append(toggleButton, deleteButton);

        card.append(
            categoryHeader,
            title,
            budget,
            status,
            actions
        );

        projectList.appendChild(card);
    });

    document.getElementById("empty-message").hidden =
        filteredProjects.length > 0;

    renderStatistics();
}

/* ========================================
   7. TAMBAH PROYEK DAN VALIDASI
======================================== */
projectForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const budget = Number(budgetInput.value);
    const completed = completedInput.checked;

    const titleError = document.getElementById("judul-error");
    const budgetError = document.getElementById("anggaran-error");
    const message = document.getElementById("form-message");

    titleError.textContent = "";
    budgetError.textContent = "";
    message.textContent = "";

    let valid = true;

    if (title === "") {
        titleError.textContent = "Nama proyek wajib diisi.";
        valid = false;
    }

    if (
        budgetInput.value.trim() === "" ||
        !Number.isFinite(budget) ||
        budget <= 0
    ) {
        budgetError.textContent =
            "Masukkan anggaran berupa angka lebih dari 0.";
        valid = false;
    }

    if (!valid) {
        message.style.color = "#c42d42";
        message.textContent = "Periksa kembali data proyek kamu.";
        return;
    }

    const newProject = {
        id: Date.now(),
        title,
        category,
        budget,
        completed
    };

    projects.push(newProject);

    projectForm.reset();

    message.style.color = "#18794e";
    message.textContent = "✓ Proyek berhasil ditambahkan!";

    renderProjects();
});

/* ========================================
   8. PENCARIAN LANGSUNG
======================================== */
searchInput.addEventListener("input", renderProjects);

/* ========================================
   9. UBAH STATUS
======================================== */
function toggleStatus(id) {
    projects = projects.map(project => {
        if (project.id === id) {
            return {
                ...project,
                completed: !project.completed
            };
        }

        return project;
    });

    renderProjects();
}

/* ========================================
   10. HAPUS PROYEK
======================================== */
function deleteProject(id) {
    projects = projects.filter(project => project.id !== id);
    renderProjects();
}

/* ========================================
   11. TAMPILKAN SAAT HALAMAN DIBUKA
======================================== */
renderProjects();
