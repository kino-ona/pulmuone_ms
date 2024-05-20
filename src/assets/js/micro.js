"use strict";

let introWheelLock = false,
	historyWheelLock = false;

$("#fullpage").fullpage({
	css3: false,
	scrollingSpeed: 600,
	controlArrows: false,
	easing: "easeInOutCubic",
	loopHorizontal: false,
	normalScrollElements: ".scroll-element",
	keyboardScrolling: false,
	scrollOverflow: true,
	scrollOverflowOptions: {
		probeType: 3,
		bounce: false
	},
	afterRender: function () {
		initArchiveSwiper();

		//mobile tab button center
		if (windowWidth <= 1200) {
			var $tabhmenu = $(".award .tab__list");
			var tabMenuClick = function () {
				$(".award .tab__list .tab__button").on("click", function (e) {
					e.preventDefault();
					var padding = 20;
					var $element = $(this);
					var tabOffset = $element.offset().left;
					var tabWidth = $element.width();
					var menuScrollLeft = $tabhmenu.scrollLeft() - padding;
					var menuWidth = $tabhmenu.width();
					var myScrollPos = tabOffset + tabWidth / 2 + menuScrollLeft - menuWidth / 4;

					$tabhmenu.stop().animate(
						{
							scrollLeft: myScrollPos - menuWidth / 4
						},
						300
					);
				});
			};
			tabMenuClick();
		}

		const iscroll = $.fn.fp_scrolloverflow.iscrollHandler.iScrollInstances[0];

		const growthCountObj = {
			duration: 3,
			startVal: 0,
			useEasing: false
		};
		const countNum = [38000, 3500, 181, 6409];

		let targetTops = [];
		let targetHeight = [];
		let target = $(".growth__item");
		target.each(function (index, item) {
			let targetTop = $(item).position().top;
			targetTops.push(targetTop);
			targetHeight.push(targetTop + $(item).innerHeight());
		});

		let elementTop, elementBottom, viewportTop, viewportBottom;
		function isScrolledIntoView(index) {
			elementTop = targetTops[index];
			elementBottom = targetHeight[index];
			viewportTop = Math.abs(iscroll.y);
			viewportBottom = viewportTop + $(".main").innerHeight();
			return elementBottom > viewportTop && elementTop < viewportBottom;
		}

		iscroll.on("scroll", function () {
			target.each(function (index, item) {
				let countEl = $(item).find(".growth__emphasis > strong");
				let countElId = countEl.attr("id");

				if (isScrolledIntoView(index) == true && !countEl.hasClass("active")) {
					let count = new countUp.CountUp(countElId, countNum[index], growthCountObj);
					count.start();
					countEl.addClass("active");
				}
			});

			if (this.y - $(".copy").height() <= this.maxScrollY) {
				if ($(window).width() >= 1200) {
					$(".quick").css("bottom", `${$(".copy").height() + 40}px`);
				} else {
					$(".quick").css("bottom", `${$(".copy").height() + 20}px`);
				}
			} else {
				$(".quick").css("bottom", "");
			}
		});

		$(".growth__list").on("touchstart", function (event) {
			let swipe = event.originalEvent.touches,
				start = swipe[0].pageY;
			if ($(window).width() <= 1200) {
				let swipe = event.originalEvent.touches,
					start = swipe[0].pageY;
				$(this)
					.on("touchmove", function (event) {
						let contact = event.originalEvent.touches,
							end = contact[0].pageY,
							distance = end - start;

						if (distance < -30) {
							// down
							iscroll.scrollBy(0, distance * 2, 1000);
						}

						if (distance > 30) {
							// up
							iscroll.scrollBy(0, distance * 2, 1000);
						}
					})
					.one("touchend", function () {
						$(this).off("touchmove touchend");
					});
			}
		});

		$(".award .tab__panel .scroll-element").on("touchstart", function (event) {
			let swipe = event.originalEvent.touches,
				start = swipe[0].pageY;
			if ($(window).width() <= 1200) {
				let swipe = event.originalEvent.touches,
					start = swipe[0].pageY;
				$(this)
					.on("touchmove", function (event) {
						let contact = event.originalEvent.touches,
							end = contact[0].pageY,
							distance = end - start;

						if (distance < -30 && Math.round($(this).scrollTop()) + $(this).innerHeight() >= $(this)[0].scrollHeight) {
							iscroll.scrollBy(0, distance * 2, 1000);
						}

						if (distance > 30 && $(this).scrollTop() <= 0) {
							iscroll.scrollTo(0, 0, 1000);
						}
					})
					.one("touchend", function () {
						$(this).off("touchmove touchend");
					});
			}
		});
	},
	onLeave: function (index, nextIndex, direction) {
		if (nextIndex === 2 && direction === "down") {
			$(".quick").addClass("quick--active");
		} else if (nextIndex === 1 && direction === "up") {
			$(".quick").removeClass("quick--active");
		}

		if (nextIndex === 2) {
			$.fn.fullpage.setAllowScrolling(true, "down");
		}

		if (nextIndex === 3) {
			if ($(".intro").hasClass("intro--start")) {
				$.fn.fullpage.setAllowScrolling(false, "up");
				$.fn.fullpage.setAllowScrolling(true, "down");
				historyWheelLock = false;
			} else {
				$.fn.fullpage.setAllowScrolling(false, "down");
				$.fn.fullpage.setAllowScrolling(true, "up");
				historyWheelLock = false;
			}
		}

		if (nextIndex !== 3) {
			$(".intro").off("wheel touchstart touchmove touchend");
		}

		if (nextIndex === 4) {
			$.fn.fullpage.setAllowScrolling(true, "up");
			$.fn.fp_scrolloverflow.iscrollHandler.iScrollInstances[0].disable();
		}
	},
	afterLoad: function (anchorLink, index) {
		if (index === 3) {
			$(".intro").on("wheel touchstart", function (event) {
				if ("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
					if (event.type === "touchstart") {
						let swipe = event.originalEvent.touches,
							start = swipe[0].pageY;
						$(this)
							.on("touchmove", function (event) {
								let contact = event.originalEvent.touches,
									end = contact[0].pageY,
									distance = end - start;

								if (distance < -30) {
									// down
									if (!$(".intro").hasClass("intro--start")) {
										$(".intro").addClass("intro--start");
									}
								}

								if (distance > 30) {
									// up
									if ($(".intro").hasClass("intro--start")) {
										$(".intro").removeClass("intro--start");
									}
								}
							})
							.one("touchend", function () {
								$(this).off("touchmove touchend");
								if ($(".intro").hasClass("intro--start")) {
									$.fn.fullpage.setAllowScrolling(true, "down");
									$.fn.fullpage.setAllowScrolling(false, "up");
								} else {
									$.fn.fullpage.setAllowScrolling(true, "up");
									$.fn.fullpage.setAllowScrolling(false, "down");
								}
							});
					}
				} else {
					if (event.type === "wheel") {
						if (event.originalEvent.deltaY > 0 && !introWheelLock) {
							if (!$(".intro").hasClass("intro--start")) {
								$.fn.fullpage.setAllowScrolling(false, "up");
								$(".intro").addClass("intro--start");
								introWheelLock = true;

								setTimeout(function () {
									$.fn.fullpage.setAllowScrolling(true, "down");
									introWheelLock = false;
								}, 800);
							}
						} else if (event.originalEvent.deltaY < 0 && !introWheelLock) {
							if ($(".intro").hasClass("intro--start")) {
								$.fn.fullpage.setAllowScrolling(false, "down");
								$(".intro").removeClass("intro--start");
								introWheelLock = true;

								setTimeout(function () {
									$.fn.fullpage.setAllowScrolling(true, "up");
									introWheelLock = false;
								}, 800);
							}
						}
					}
				}
			});
		}

		if (index === 5) {
			$.fn.fp_scrolloverflow.iscrollHandler.iScrollInstances[0].enable();
		}
	}
});

const historySwiper = new Swiper(".history .swiper", {
	speed: 700,
	slidesPerView: "auto",
	spaceBetween: 20
});

// Touch handling

//archive pc swiper
let archiveSwiper = undefined;
let windowWidth = window.innerWidth;

const initArchiveSwiper = () => {
	if (windowWidth > 1200 && archiveSwiper == undefined) {
		archiveSwiper = new Swiper(".archive__swiper", {
			autoplay: {
				delay: 1,
				desableOnInteraction: false
			},
			spaceBetween: 28,
			speed: 8000,
			loop: true,
			loopedSlides: 1,
			slidesPerView: "auto",
			freemode: true
		});
	} else if (windowWidth <= 1200 && archiveSwiper !== undefined) {
		archiveSwiper.destroy();
		archiveSwiper = undefined;
	}
};

//archive mo more btn
const archiveBtn = document.querySelector(".archive__mobileBox .archive__btnBox");
const archiveList = document.querySelectorAll(".archive__mobileBox .archive__list");

archiveBtn.addEventListener("click", function () {
	archiveList.forEach(function (list) {
		list.style.display = "block";
	});
	this.style.display = "none";
	$.fn.fullpage.reBuild();
});

$(document).ready(function () {});
