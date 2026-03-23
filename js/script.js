if (!window.location.pathname.includes("about-products")) {
  // ❌ product code skip
} else {
  // ✅ product code yaha
}



// ================= MENU TOGGLE =================
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}


// ================= PARTNER SLIDER =================
const track = document.getElementById("track");

if (track) {

  // duplicate for infinite effect
  track.innerHTML += track.innerHTML;

  let position = 0;
  const speed = 1; // speed control

  function animate() {
    position += speed;

    if (position >= track.scrollWidth / 2) {
      position = 0;
    }

    track.style.transform = `translateX(-${position}px)`;

    requestAnimationFrame(animate);
  }

  animate();
}


// ================= SAFE DOM LOAD =================
document.addEventListener("DOMContentLoaded", () => {

  // ================= DROPDOWN (MOBILE) =================
  const arrows = document.querySelectorAll(".arrow-toggle");

  if (arrows.length > 0) {
    arrows.forEach(arrow => {
      arrow.addEventListener("click", function(e) {

        if (window.innerWidth <= 768) {
          e.stopPropagation();

          let parent = this.closest(".dropdown");
          parent.classList.toggle("active");
        }

      });
    });
  }


  // ================= PRODUCT PAGE =================
  const mainImage = document.getElementById("mainImage");

  if (mainImage) {

    let params = new URLSearchParams(window.location.search);
    let currentId = parseInt(params.get("id")) || 1;

    fetch("../data.json")
      .then(res => res.json())
      .then(data => {

        console.log("DATA LOADED ✅", data);

        let product = data.products.find(p => p.id === currentId);

        if (!product) {
          console.error("Product not found ❌");
          return;
        }

        const productName = document.getElementById("productName");
        const productSubtitle = document.getElementById("productSubtitle");
        const productDesc = document.getElementById("productDesc");
        const productFeatures = document.getElementById("productFeatures");
        const relatedProducts = document.getElementById("relatedProducts");

        if (!productName || !productDesc || !relatedProducts) {
          console.error("HTML ID missing ❌");
          return;
        }

        // MAIN PRODUCT
        mainImage.src = product.image;
        mainImage.onerror = () => {
          mainImage.src = "/images/default.jpg";
        };

        productName.innerText = product.name;
        productSubtitle.innerText = product.subtitle;

        productDesc.innerHTML = product.description
          ? product.description.replace(/\n/g, "<br>")
          : "";

        // FEATURES
        let featuresHTML = "";
        if (product.features && product.features.length > 0) {
          product.features.forEach(f => {
            featuresHTML += `<li>${f}</li>`;
          });
        }
        productFeatures.innerHTML = featuresHTML;

        // RELATED PRODUCTS
        let relatedHTML = "";

        let relatedItems = data.products.filter(p =>
          product.related.includes(p.id)
        );

        relatedItems.forEach(item => {
          relatedHTML += `
            <div class="rel-card">
              <img src="${item.image}" onerror="this.src='/images/default.jpg'">
              <div class="rel-bottom">
                <span>${item.name}</span>
                <button onclick="goToProduct(${item.id})">View</button>
              </div>
            </div>
          `;
        });

        relatedProducts.innerHTML = relatedHTML;

      })
      .catch(err => console.error("JSON load error ❌:", err));
  }


  // ================= IMAGE ZOOM =================
  const zoomContainer = document.querySelector(".zoom-container");
  const zoomImage = document.getElementById("mainImage");

  if (zoomContainer && zoomImage) {

    zoomContainer.addEventListener("mousemove", (e) => {
      const rect = zoomContainer.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      zoomImage.style.transformOrigin = `${xPercent}% ${yPercent}%`;
      zoomImage.style.transform = "scale(2)";
    });

    zoomContainer.addEventListener("mouseleave", () => {
      zoomImage.style.transform = "scale(1)";
      zoomImage.style.transformOrigin = "center";
    });

  }

});


// ================= PAGE SWITCH =================
function goToProduct(id) {
  window.location.href = `about-products.html?id=${id}`;
}