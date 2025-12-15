// ==========================
// 🎞️ CARRUSEL AUTOMÁTICO (INDEX)
// ==========================
const slide = document.querySelector(".slide");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

let index = 0;
const total = document.querySelectorAll(".item").length;

function showSlide() {
  slide.style.transform = `translateX(-${index * 100}%)`;
}

if (next && prev && slide) {
  next.addEventListener("click", () => {
    index = (index + 1) % total;
    showSlide();
  });

  prev.addEventListener("click", () => {
    index = (index - 1 + total) % total;
    showSlide();
  });

  setInterval(() => {
    index = (index + 1) % total;
    showSlide();
  }, 5000);
}

// ==========================
// ✨ ANIMACIONES DE ENTRADA
// ==========================
window.addEventListener("load", () => {
  const logo = document.querySelector(".logo");
  const title = document.querySelector(".hero-title");
  if (logo) logo.style.opacity = "1";
  if (title) title.style.opacity = "1";
});

// ==========================
// 🛒 CARRITO GLOBAL AURATECH
// ==========================

// Elementos base
const carrito = document.querySelector(".carrito");
const dropdown = document.querySelector(".dropdown-carrito");
const cartItemsContainer = document.getElementById("cart-items");

// Array de productos (se recupera o se inicia vacío)
let carritoProductos = JSON.parse(localStorage.getItem("carritoAuraTech")) || [];

// Control de visibilidad del carrito
let carritoAbierto = false;

// Mostrar/ocultar carrito al hacer clic en el ícono
if (carrito) {
  carrito.addEventListener("click", (e) => {
    e.stopPropagation();
    carritoAbierto = !carritoAbierto;
    dropdown.style.display = carritoAbierto ? "block" : "none";
  });
}

// ==========================
// 🔄 Actualizar Carrito
// ==========================
function actualizarCarrito() {
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  if (carritoProductos.length === 0) {
    cartItemsContainer.innerHTML = `<tr><td colspan="5" class="empty">Carrito vacío</td></tr>`;
    document.querySelector(".cart-total").textContent = "Total: S/ 0.00";
    localStorage.setItem("carritoAuraTech", JSON.stringify(carritoProductos));
    return;
  }

  let total = 0;
  carritoProductos.forEach((producto, i) => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    const fila = `
      <tr>
        <td><img src="${producto.imagen}" width="40"></td>
        <td>${producto.nombre}</td>
        <td>S/ ${producto.precio.toFixed(2)}</td>
        <td>
          <button class="menos" data-index="${i}">−</button>
          <span class="cantidad">${producto.cantidad}</span>
          <button class="mas" data-index="${i}">+</button>
        </td>
        <td><button class="eliminar" data-index="${i}">❌</button></td>
      </tr>
    `;
    cartItemsContainer.innerHTML += fila;
  });

  document.querySelector(".cart-total").textContent = `Total: S/ ${total.toFixed(2)}`;
  localStorage.setItem("carritoAuraTech", JSON.stringify(carritoProductos));
}

// ==========================
// ➕ Agregar al Carrito
// ==========================
function agregarAlCarritoDesdeBotones() {
  document.querySelectorAll(".agregar-carrito").forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      const nombre = card.querySelector("h3").textContent.trim();
      const precioTexto = card.querySelector(".precio").textContent.trim();
      const precio = parseFloat(precioTexto.replace(/[^\d.]/g, ""));
      const imagen = card.querySelector("img").src;

      if (isNaN(precio)) return;

      const existente = carritoProductos.find((p) => p.nombre === nombre);
      if (existente) {
        existente.cantidad += 1;
      } else {
        carritoProductos.push({ nombre, precio, imagen, cantidad: 1 });
      }

      actualizarCarrito();
    });
  });
}

// ==========================
// ♻️ Controles (+, −, ❌)
// ==========================
if (cartItemsContainer) {
  cartItemsContainer.addEventListener("click", (e) => {
    e.stopPropagation();
    const index = e.target.getAttribute("data-index");

    if (e.target.classList.contains("mas")) {
      carritoProductos[index].cantidad++;
    } else if (e.target.classList.contains("menos")) {
      carritoProductos[index].cantidad--;
      if (carritoProductos[index].cantidad <= 0) carritoProductos.splice(index, 1);
    } else if (e.target.classList.contains("eliminar")) {
      carritoProductos.splice(index, 1);
    }

    actualizarCarrito();
  });
}

// ==========================
// 🚀 Inicialización global
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  agregarAlCarritoDesdeBotones();
  actualizarCarrito();
});


// ==========================
// 🔍 BUSCADOR CON SUGERENCIAS
// ==========================
const searchInput = document.getElementById("search");
const sugerenciasDiv = document.getElementById("sugerencias");

if (searchInput && sugerenciasDiv) {
  const productos = Array.from(document.querySelectorAll(".card")).map((card) => ({
    nombre: card.querySelector("h3").textContent.trim(),
    descripcion: card.querySelector("p").textContent.trim(),
    elemento: card,
  }));

  searchInput.addEventListener("input", () => {
    const texto = searchInput.value.toLowerCase().trim();
    sugerenciasDiv.innerHTML = "";

    if (texto === "") {
      sugerenciasDiv.style.display = "none";
      productos.forEach((p) => (p.elemento.style.display = "block"));
      return;
    }

    const coincidencias = productos.filter(
      (p) => p.nombre.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto)
    );

    if (coincidencias.length > 0) {
      coincidencias.forEach((p) => {
        const sugerencia = document.createElement("div");
        sugerencia.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> ${p.nombre}`;
        sugerencia.addEventListener("click", () => {
          searchInput.value = p.nombre;
          sugerenciasDiv.style.display = "none";
          productos.forEach((prod) => {
            prod.elemento.style.display = prod.nombre === p.nombre ? "block" : "none";
          });
        });
        sugerenciasDiv.appendChild(sugerencia);
      });
    } else {
      sugerenciasDiv.innerHTML = "<div>No se encontraron resultados</div>";
    }

    sugerenciasDiv.style.display = "block";
  });
}

// ==========================
// 💻 SLIDER DE LAPTOPS
// ==========================
const laptopSlider = document.querySelector(".laptop-slider");
const btnNext = document.querySelector(".slider-btn.next");
const btnPrev = document.querySelector(".slider-btn.prev");

if (laptopSlider && btnNext && btnPrev) {
  const slides = Array.from(laptopSlider.children);
  slides.forEach(slide => laptopSlider.appendChild(slide.cloneNode(true)));
  const cardWidth = slides[0].offsetWidth + 20;
  let currentScroll = 0;

  function moveSlider(amount) {
    currentScroll += amount;
    laptopSlider.scrollTo({ left: currentScroll, behavior: "smooth" });
    if (currentScroll >= laptopSlider.scrollWidth / 2) currentScroll = 0;
    if (currentScroll < 0) currentScroll = laptopSlider.scrollWidth / 2 - cardWidth;
  }

  btnNext.addEventListener("click", () => moveSlider(cardWidth));
  btnPrev.addEventListener("click", () => moveSlider(-cardWidth));
}

// ==========================
// ⚙️ CATALOGO COMPONENTES
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const categorias = document.querySelectorAll(".lista-categorias a");
  const contenedor = document.getElementById("contenedor-productos");
  const titulo = document.getElementById("titulo-categoria");
  if (!categorias.length) return;

  const productos = {
    tarjetas: [
      { img: "images/p3.webp", nombre: "RTX 4060 8GB", desc: "NVIDIA, alto rendimiento", precio: "S/ 1450.00" },
      { img: "images/p9.webp", nombre: "RTX 4070 Ti", desc: "12GB GDDR6X", precio: "S/ 2450.00" }
    ],
    procesadores: [
      { img: "images/p10.jpg", nombre: "Intel i5 12400F", desc: "6 núcleos, 12 hilos", precio: "S/ 880.00" },
      { img: "images/p10.jpg", nombre: "Ryzen 5 5600X", desc: "6 núcleos, 12 hilos", precio: "S/ 920.00" }
    ]
  };

  categorias.forEach(cat => {
    cat.addEventListener("click", e => {
      e.preventDefault();
      categorias.forEach(c => c.classList.remove("activa"));
      cat.classList.add("activa");
      const tipo = cat.dataset.cat;
      if (titulo) titulo.textContent = "🧩 " + cat.textContent;
      mostrarProductos(productos[tipo]);
    });
  });

  function mostrarProductos(lista) {
    if (!contenedor) return;
    contenedor.innerHTML = "";
    lista.forEach(prod => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="${prod.img}" alt="${prod.nombre}">
        <h3>${prod.nombre}</h3>
        <p>${prod.desc}</p>
        <span class="precio">${prod.precio}</span>
        <button>Agregar al carrito</button>
      `;
      contenedor.appendChild(card);
    });
  }
});

