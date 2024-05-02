"use strict";

//archive swiper
const swiper = new Swiper(".archive__swiper", {
	autoplay: {
		delay: 0,
		desableOnInteraction: false
	},
	speed: 8000,
	loop: true,
	slidesPerView: "auto",
	freemode: true
});
