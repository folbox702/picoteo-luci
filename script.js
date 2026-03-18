// Supabase Configuration
const SUPABASE_URL = 'https://aueuathmqhokddmmrwir.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wGVtTAemO3xx3W3Mb8TmHw_9YBkT_oK';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Data Variable
let menuItems = [];

// Fallback Data (Original menuData)
const menuDataFallback = [
    {
        id: 1,
        name: "Especial Tía Lucy",
        category: "Criollazos",
        description: "Nuestro plato insignia con lomo saltado, arroz, huevo frito y plátano frito.",
        price: "12.500",
        img: "https://images.unsplash.com/photo-1562607311-66d499ba5627?q=80&w=2070&auto=format&fit=crop",
        badge: "⭐"
    },
    {
        id: 2,
        name: "Lomo Saltado",
        category: "Criollazos",
        description: "Trozos de carne salteados al wok con cebolla, tomate y papas fritas.",
        price: "10.900",
        img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97eb4?q=80&w=1974&auto=format&fit=crop",
        badge: "Popular"
    },
    {
        id: 3,
        name: "Ceviche Clásico",
        category: "Pescados",
        description: "Pescado fresco marinado en limón sutil, ají limo y cilantro.",
        price: "11.500",
        img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=2069&auto=format&fit=crop",
        badge: "⭐"
    },
    {
        id: 4,
        name: "Arroz Chaufa de Pollo",
        category: "Chifa",
        description: "Arroz frito al estilo peruano-chino con trozos de pollo y cebollín.",
        price: "9.500",
        img: "https://images.unsplash.com/photo-1603133872871-0c512f548d1c?q=80&w=1974&auto=format&fit=crop",
        badge: ""
    },
    {
        id: 5,
        name: "Parrillada Familiar",
        category: "Parrilladas",
        description: "Combinación de carnes a la parrilla con papas y ensalada.",
        price: "24.900",
        img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop",
        badge: "⭐"
    },
    {
        id: 6,
        name: "Pollo a la Brasa",
        category: "Brasas",
        description: "Pollo marinado en especias secretas, asado al carbón.",
        price: "14.500",
        img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=1976&auto=format&fit=crop",
        badge: "Popular"
    },
    {
        id: 7,
        name: "Suspiro Limeño",
        category: "Postres",
        description: "Tradicional postre limeño a base de manjar blanco y merengue.",
        price: "4.500",
        img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1964&auto=format&fit=crop",
        badge: ""
    }
];

const menuGrid = document.getElementById('menu-grid');
const filterBtns = document.querySelectorAll('.filter-btn');

// Currency Formatter for CLP ($9.990)
function formatCLP(value) {
    return '$' + Number(value).toLocaleString('de-DE');
}

async function fetchMenu() {
    try {
        const { data, error } = await supabaseClient
            .from('menu')
            .select('plato_nombre, descripcion, precio_clp, imagen_url, categoria_id, etiqueta_especial');

        if (error) throw error;
        
        if (data && data.length > 0) {
            menuItems = data;
        } else {
            console.warn("No data from Supabase, using fallback.");
            menuItems = menuDataFallback.map(item => ({
                plato_nombre: item.name,
                precio_clp: item.price.replace('.', ''),
                descripcion: item.description,
                etiqueta_especial: item.badge,
                categoria_id: item.category === 'Pescados' ? 1 : 
                              item.category === 'Criollazos' ? 2 : 
                              item.category === 'Chifa' ? 3 : 
                              item.category === 'Parrilladas' ? 4 : 
                              item.category === 'Brasas' ? 5 : 6,
                imagen_url: item.img
            }));
        }
    } catch (err) {
        console.error("Error fetching menu:", err.message);
        menuItems = menuDataFallback.map(item => ({
            plato_nombre: item.name,
            precio_clp: item.price.replace('.', ''),
            descripcion: item.description,
            etiqueta_especial: item.badge,
            categoria_id: item.category === 'Pescados' ? 1 : 
                          item.category === 'Criollazos' ? 2 : 
                          item.category === 'Chifa' ? 3 : 
                          item.category === 'Parrilladas' ? 4 : 
                          item.category === 'Brasas' ? 5 : 6,
            imagen_url: item.img
        }));
    }
    renderMenu();
}

function renderMenu(category = 'Todos') {
    const filteredMenu = category === 'Todos' 
        ? menuItems 
        : menuItems.filter(item => String(item.categoria_id) === String(category));

    if (filteredMenu.length === 0) {
        menuGrid.innerHTML = '<p class="no-items" style="grid-column: 1/-1; text-align: center; padding: 3rem; font-size: 1.2rem; color: #777;">Próximamente más delicias en esta categoría...</p>';
        return;
    }

    menuGrid.innerHTML = filteredMenu.map(item => {
        const hasImage = !!item.imagen_url;
        const imgSrc = hasImage ? item.imagen_url : '';
        
        return `
            <div class="menu-card">
                <div class="card-img ${!hasImage ? 'placeholder' : ''}" style="${hasImage ? `background-image: url('${imgSrc}')` : ''}">
                    ${item.etiqueta_especial ? `<span class="badge">${item.etiqueta_especial}</span>` : ''}
                </div>
                <div class="card-body">
                    <h3>${item.plato_nombre}</h3>
                    <p class="card-description">${item.descripcion || 'Auténtico sabor peruano preparado con los mejores ingredientes.'}</p>
                    <div class="card-footer">
                        <span class="price">${formatCLP(item.precio_clp)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Initial fetch
document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
});

// Filter Event Listeners
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-category');
        renderMenu(category);
    });
});

// Smooth Scrolling for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
