"use strict";

//archive swiper
const archiveBox = document.querySelector(".archive__pcBox");
const archiveContainers = document.querySelectorAll(".archive__swiper");
const archiveList = [];

archiveContainers.forEach((container, index) => {
	const archiveSwiper = new Swiper(container, {
		autoplay: {
			delay: 0,
			disableOnInteraction: false
			//pauseOnMouseEnter: true
		},
		speed: 5000,
		loop: true,
		slidesPerView: "auto",
		spaceBetween: 20,
		allowTouchMove: false
	});
	archiveList.push(archiveSwiper);
});

function stopAllSwipers() {
	archiveList.forEach((archiveSwiper) => {
		archiveSwiper.autoplay.stop();
	});
}

function startAllSwipers() {
	archiveList.forEach((archiveSwiper) => {
		archiveSwiper.autoplay.start();
	});
}

archiveBox.addEventListener("mouseenter", () => {
	archiveContainers.forEach((container) => {
		stopAllSwipers();
	});
});

archiveBox.addEventListener("mouseleave", () => {
	archiveContainers.forEach((container) => {
		startAllSwipers();
	});
});
