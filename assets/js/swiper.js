document.addEventListener("DOMContentLoaded", () => {
  const swiper = new Swiper(".swiper", {
    // Optional parameters

    autoplay: {
      delay: 5000,
    },
    direction: "horizontal",
    loop: true,

    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
    },

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    // And if we need scrollbar
    scrollbar: {
      el: ".swiper-scrollbar",
    },
  });
  const clientSwiper = new Swiper(".client-swiper", {
    // Optional parameters
    centeredSlides: true,
    spaceBetween: 20,
    autoplay: {
      delay: 2000,
    },
    slidesPerView: 4,
    direction: "horizontal",
    loop: true,
    // breakpoints: {
    //   // When window width is >= 1024px (Large screens)
    //   1024: {
    //     slidesPerView: 3,
    //     spaceBetween: 20,
    //   },
    //   // When window width is >= 768px (Tablets)
    //   768: {
    //     slidesPerView: 2,
    //     spaceBetween: 15,
    //   },
    //   // When window width is >= 480px (Mobile devices)
    //   480: {
    //     slidesPerView: 1,
    //     spaceBetween: 10,
    //   },
    // },
  });
});
