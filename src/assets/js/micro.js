"use strict";

//archive swiper
const archiveBox = document.querySelector(".archive_box");
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

//lottie
let animation1 = bodymovin.loadAnimation({
	container: document.getElementById("lottie_1"), // Required
	path: "https://assets5.lottiefiles.com/packages/lf20_ngcpf3x7.json", //path: 'data.json', // 실제 사용 폴더 지정 ex) data.json
	renderer: "svg", // Required
	loop: true, // Optional
	autoplay: true // Optional
});

let animation2 = bodymovin.loadAnimation({
	container: document.getElementById("lottie_2"), // Required
	path: "https://assets1.lottiefiles.com/packages/lf20_yoltywwd.json", //path: 'data.json', // 실제 사용 폴더 지정 ex) data.json
	renderer: "svg", // Required
	loop: true, // Optional
	autoplay: true // Optional
});
