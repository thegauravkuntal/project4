// ================= SAFE PRODUCT PAGE CHECK =================

if (!window.location.pathname.includes("about-products")) {
  // ❌ product code skip
} else {
  // ✅ product code yaha
}


// ================= MENU TOGGLE =================

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}



// ================= HERO SLIDER =================

const heroSlider = document.getElementById("heroSlider");

if (heroSlider) {

  const slides =
    document.querySelectorAll(".hero-slide");

  // CLONE FIRST SLIDE
  const firstClone =
    slides[0].cloneNode(true);

  heroSlider.appendChild(firstClone);

  let currentSlide = 0;

  const totalSlides =
    document.querySelectorAll(".hero-slide").length;

  function moveSlider() {

    currentSlide++;

    heroSlider.style.transition =
      "transform 0.8s ease-in-out";

    heroSlider.style.transform =
      `translateX(-${currentSlide * 100}%)`;

    // LAST CLONE
    if (currentSlide === totalSlides - 1) {

      setTimeout(() => {

        heroSlider.style.transition = "none";

        currentSlide = 0;

        heroSlider.style.transform =
          `translateX(0%)`;

      }, 800);
    }
  }

  // AUTO SLIDE
  setInterval(moveSlider, 3000);
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

        const galleryThumbs = document.getElementById("galleryThumbs");

        if (!productName || !productDesc || !relatedProducts) {

          console.error("HTML ID missing ❌");

          return;
        }

        // MAIN PRODUCT

        mainImage.src = product.image;

        // PRODUCT GALLERY

if(product.gallery && galleryThumbs){

    let thumbsHTML = "";

    product.gallery.forEach((img,index)=>{

        thumbsHTML += `
            <img
                src="${img}"
                class="${index === 0 ? 'active' : ''}"
                onclick="changeMainImage(this,'${img}')"
            >
        `;

    });

    galleryThumbs.innerHTML = thumbsHTML;
}

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

      <img src="${item.image}"
           alt="${item.name}"
           onerror="this.src='/images/default.jpg'">

      <div class="rel-bottom">

        <span>${item.name}</span>

        <button onclick="goToProduct(${item.id})">
          → READ MORE
        </button>

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





function toggleQualityMasterDetails(){

    document
    .getElementById("qualityMasterDetails")
    .classList.toggle("show");

}










function toggleAirDryerDetails(){

    document
    .getElementById("airDryerDetails")
    .classList.toggle("show");

}








function changeMainImage(el,img){

    document.getElementById("mainImage").src = img;

    document
      .querySelectorAll(".gallery-thumbs img")
      .forEach(item => item.classList.remove("active"));

    el.classList.add("active");
}