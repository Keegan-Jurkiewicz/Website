/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});
// ===== Get Quote: trip types + legs =====
document.addEventListener('DOMContentLoaded', () => {
	// --- Element refs (must match your index.html ids) ---
	const tripTypeSel      = document.getElementById('trip_type');
	const legFromTemp      = document.getElementById('legFrom');
	const legToTemp        = document.getElementById('legTo');
	const legDateTimeTemp  = document.getElementById('legDateTime');
	const addLegBtn        = document.getElementById('addLegBtn');
	const clearLegsBtn     = document.getElementById('clearLegsBtn');
	const legsList         = document.getElementById('legsList');
	const itineraryTA      = document.getElementById('itineraryDisplay'); // read-only textarea
	const legsJsonHidden   = document.getElementById('legsJson');         // hidden input sent to Formspree
	const rtAutoHidden     = document.getElementById('rtAuto');           // hidden "round_trip_auto" (optional)
  
	// If any required element is missing, bail quietly.
	if (!tripTypeSel || !legFromTemp || !legToTemp || !legDateTimeTemp || !addLegBtn || !clearLegsBtn || !legsList) {
	  return;
	}
  
	// --- State ---
	/** @type {{from:string,to:string,dt:string}[]} */
	const legs = [];
  
	// --- Helpers ---
	const tidy = (s) => (s || '').trim().toUpperCase();
  
	function clearEditor() {
	  legFromTemp.value = '';
	  legToTemp.value = '';
	  legDateTimeTemp.value = '';
	}
  
	function formatDT(dtStr) {
	  if (!dtStr) return '—';
	  // show local date & time nicely
	  const d = new Date(dtStr);
	  if (Number.isNaN(d.getTime())) return dtStr;
	  // e.g., 2025-09-18 14:35
	  const yyyy = d.getFullYear();
	  const mm = String(d.getMonth()+1).padStart(2,'0');
	  const dd = String(d.getDate()).padStart(2,'0');
	  const hh = String(d.getHours()).padStart(2,'0');
	  const mi = String(d.getMinutes()).padStart(2,'0');
	  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
	}
  
	function renderLegs() {
	  // Render the list with remove buttons
	  legsList.innerHTML = '';
	  if (legs.length) {
		legs.forEach((leg, idx) => {
		  const row = document.createElement('div');
		  row.className = 'leg-row';
		  row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin:.4rem 0;';
		  const label = document.createElement('div');
		  label.textContent = `Leg ${idx+1}: ${leg.from} ➜ ${leg.to} @ ${formatDT(leg.dt)}`;
		  const remove = document.createElement('button');
		  remove.type = 'button';
		  remove.className = 'button small removeLegBtn';
		  remove.dataset.idx = String(idx);
		  remove.textContent = 'Remove';
		  row.appendChild(label);
		  row.appendChild(remove);
		  legsList.appendChild(row);
		});
	  }
  
	  // Update the read-only itinerary textarea (nice for the user)
	  if (itineraryTA) {
		itineraryTA.value = legs.length
		  ? legs.map((l, i) => `Leg ${i+1}: ${l.from} ➜ ${l.to} @ ${formatDT(l.dt)}`).join('\n')
		  : '';
	  }
  
	  // Update the hidden JSON for Formspree (this is what you’ll read in the email)
	  if (legsJsonHidden) {
		legsJsonHidden.value = JSON.stringify(legs);
	  }
	}
  
	// --- Trip type changes ---
	tripTypeSel.addEventListener('change', () => {
	  // Reset any auto-RT flag (optional, safe if missing)
	  if (rtAutoHidden) rtAutoHidden.value = (tripTypeSel.value === 'Round Trip') ? 'true' : 'false';
	  // We do NOT auto-clear legs on type change; user might be toggling.
	  // If you WANT to clear, uncomment next two lines:
	  // legs.length = 0;
	  // renderLegs();
	});
  
	// --- Add leg ---
	addLegBtn.addEventListener('click', () => {
	  const from = tidy(legFromTemp.value);
	  const to   = tidy(legToTemp.value);
	  const dt   = (legDateTimeTemp.value || '').trim();
  
	  if (!from || !to || !dt) {
		alert('Please fill From, To, and Departure Date & Time for this leg.');
		return;
	  }
  
	  // Add the leg the user just entered
	  legs.push({ from, to, dt });
  
	  // If Round Trip and this is the first leg, auto-add a return leg (date left blank)
	  if (tripTypeSel.value === 'Round Trip' && legs.length === 1) {
		legs.push({ from: to, to: from, dt: '' });
		if (rtAutoHidden) rtAutoHidden.value = 'true';
	  }
  
	  renderLegs();
	  clearEditor();
	});
  
	// --- Clear all legs ---
	clearLegsBtn.addEventListener('click', () => {
	  legs.length = 0;
	  renderLegs();
	});
  
	// --- Remove a single leg (event delegation) ---
	legsList.addEventListener('click', (e) => {
	  const btn = e.target.closest?.('.removeLegBtn');
	  if (!btn) return;
	  const idx = parseInt(btn.dataset.idx, 10);
	  if (!Number.isNaN(idx)) {
		legs.splice(idx, 1);
		renderLegs();
	  }
	});
  });
  
 // ===== Quote form: unified One vs Multi (Round-Trip/Multi-City) =====
(function () {
	var tripTypeEl           = document.getElementById('tripType') || document.querySelector('select[name="trip_type"]');
	var legFromEl            = document.getElementById('legFrom');
	var legToEl              = document.getElementById('legTo');
	var legDateTimeEl        = document.getElementById('legDateTime');
	var addLegBtn            = document.getElementById('addLegBtn');
	var clearLegsBtn         = document.getElementById('clearLegsBtn');
	var legsListEl           = document.getElementById('legsList');
	var itineraryDisplayEl   = document.getElementById('itineraryDisplay');
	var legsJsonEl           = document.getElementById('legsJson');
  
	if (!tripTypeEl || !legFromEl || !legToEl || !legDateTimeEl || !addLegBtn || !legsListEl || !itineraryDisplayEl || !legsJsonEl) return;
  
	var legs = [];
  
	function getTripType() {
	  // Treat anything not "one" as multi (covers “Round-Trip or Multi-City”)
	  var v = (tripTypeEl.value || '').toLowerCase();
	  return v === 'one' ? 'one' : 'multi';
	}
  
	function renderLegs() {
	  legsListEl.innerHTML = '';
	  legs.forEach(function (leg, idx) {
		var row = document.createElement('div');
		row.style.display = 'flex';
		row.style.alignItems = 'center';
		row.style.justifyContent = 'space-between';
		row.style.gap = '.5rem';
		row.style.margin = '.25rem 0';
  
		var timeStr = leg.datetime ? (' @ ' + leg.datetime) : ' (date/time TBD)';
		var txt = document.createElement('div');
		txt.textContent = 'Leg ' + (idx + 1) + ': ' + leg.from + ' ➝ ' + leg.to + timeStr;
  
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'button small';
		btn.textContent = 'Remove';
		btn.addEventListener('click', function () {
		  legs.splice(idx, 1);
		  renderLegs();
		});
  
		row.appendChild(txt);
		row.appendChild(btn);
		legsListEl.appendChild(row);
	  });
  
	  // Read-only itinerary textarea
	  itineraryDisplayEl.value = legs.map(function (leg, i) {
		return 'Leg ' + (i + 1) + ': ' + leg.from + ' ➝ ' + leg.to + (leg.datetime ? ' @ ' + leg.datetime : ' (date/time TBD)');
	  }).join('\n');
  
	  // Hidden JSON payload to Formspree
	  legsJsonEl.value = JSON.stringify(legs);
	}
  
	function clearEditor() {
	  legFromEl.value = '';
	  legToEl.value = '';
	  legDateTimeEl.value = '';
	  // Make sure user can type/pick
	  legDateTimeEl.disabled = false;
	  legDateTimeEl.readOnly = false;
	}
  
	function clearLegs() {
	  legs.length = 0;
	  renderLegs();
	  clearEditor();
	}
  
	function addLeg() {
	  var from = (legFromEl.value || '').trim().toUpperCase();
	  var to   = (legToEl.value || '').trim().toUpperCase();
	  var dt   = (legDateTimeEl.value || '').trim();
  
	  if (!from || !to) {
		alert('Please fill From and To.');
		return;
	  }
  
	  legs.push({ from: from, to: to, datetime: dt });
	  renderLegs();
  
	  if (getTripType() === 'multi') {
		// Chain routing for both Round-Trip and Multi-City:
		// Next leg starts FROM last TO; user fills in the new TO + time.
		legFromEl.value = to;
		legToEl.value = '';
		legDateTimeEl.value = '';
		legDateTimeEl.disabled = false;
		legDateTimeEl.readOnly = false;
		legToEl.focus();
	  } else {
		// One way: clear editor fully
		clearEditor();
	  }
	}
  
	// Wire up events
	addLegBtn.addEventListener('click', addLeg);
	if (clearLegsBtn) clearLegsBtn.addEventListener('click', clearLegs);
	tripTypeEl.addEventListener('change', clearLegs);
  })();  
  
})(jQuery);