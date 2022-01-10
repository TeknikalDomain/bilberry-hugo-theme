// dependencies
require('jquery')
require('flexslider')
require('algoliasearch/dist/algoliasearch.jquery')
require('autocomplete.js/dist/autocomplete.jquery')
require('tooltipster')
require('magnific-popup')
require('lazysizes')

let ClipboardJs = require('clipboard')
let hljs = require('highlight.js')
let moment = require('moment')
require('moment/min/locales.min')

// Add ClipboardJs to enable copy button functionality
new ClipboardJs('.copy-button', {
    target: function(trigger) {
        return trigger.previousElementSibling
    },
}).on('success', function(e) {
    e.clearSelection()
})

// Subtitle taglines
let taglines = []
let rawsub = ''
let subtitle = $('.subtitle')[0]

function setTagline() {
    let thisTagline = taglines[Math.floor(Math.random() * taglines.length)]

    if (rawsub == '') {
	rawsub = subtitle.innerHTML
    }

    subtitle.innerHTML = rawsub

    if (thisTagline == '') {
	return
    }

    if (thisTagline == '<COUNT>') {
	thisTagline = taglines.length + ' taglines and counting...'
    }

    if (thisTagline == '<PERCENT>') {
	thisTagline =
	    "Did you know what if you're looking for a specific tagline in here, there's only a " +
	    (1 / taglines.length) * 100 +
	    "% chance of getting it each load?"
    }

    subtitle.innerHTML = rawsub + ' | ' + thisTagline
}

// Custom temperature display
function changeTempUnit() {
    var tempInF = localStorage.getItem('temp_in_f') === 'false'
    localStorage.setItem('temp_in_f', tempInF) // Toggle F <-> C and store
    updateTemps()
}

function updateTemps() {
    var tempInF = localStorage.getItem('temp_in_f') === 'true'

    // Default to displaying in C if unspecificed (aka never ran before)
    if (tempInF === null) {
        localStorage.setItem('temp_in_f', false)
        tempInF = false
    }

    // Process each figure
    $('.temperature-reading').each(function() {
        var tempC = parseFloat(this.getAttribute('data-temp')) // ALWAYS in C
        if (tempInF === true) {
            // Only run conversion math if requested
            this.innerHTML =
                (Math.round((tempC * 1.8 + 32) * 100) / 100).toString() +
                '°' +
                'F'
        } else {
            this.innerHTML =
                (Math.round(tempC * 100) / 100).toString() + '°' + 'C'
        }
    })
}

$(document).ready(function() {
    // Add copy button and tooltip to each code-block
    $('pre').each(function() {
        $(this).append(
            '<button class="copy-button tooltip" title="Copied!"><i class="far fa-fw fa-copy"></i></button>',
        )
    })

    $('.tooltip').tooltipster({
        animationDuration: 1,
        theme: 'tooltipster-light',
        side: 'bottom',
        delay: [200, 0],
        distance: 0,
        trigger: 'custom',
        triggerOpen: {
            click: true,
            tap: true,
        },
        triggerClose: {
            click: true,
            tap: true,
            mouseleave: true,
        },
    })

    // Nav-Toggle
    $('.toggler').click(function() {
        $('nav#topnav').slideToggle()
        $('#search').autocomplete('val', '')
    })

    // Commento support to block search focus when hitting the S key
    blockSearchFocusCommento = false;

    $('#commento').focusin(function() {
        blockSearchFocusCommento = true;
    });

    $('#commento').focusout(function() {
        blockSearchFocusCommento = false;
    });

    // Utterances support to block search focus when hitting the S key
    blockSearchFocusUtterances = false;

    $('#utterances').focusin(function() {
        blockSearchFocusUtterances = true;
    });

    $('#utterances').focusout(function() {
        blockSearchFocusUtterances = false;
    });

    // Giscus support to block search focus when hitting the S key
    blockSearchFocusGiscus = false;

    $('#giscus').focusin(function() {
        blockSearchFocusGiscus = true;
    });

    $('#giscus').focusout(function() {
        blockSearchFocusGiscus = false;
    });

    // Utterances support to block search focus when hitting the S key
    blockSearchFocusUtterances = false;

    $('#utterances').focusin(function() {
        blockSearchFocusUtterances = true;
    });

    $('#utterances').focusout(function() {
        blockSearchFocusUtterances = false;
    });

    // Giscus support to block search focus when hitting the S key
    blockSearchFocusGiscus = false;

    $('#giscus').focusin(function() {
        blockSearchFocusGiscus = true;
    });

    $('#giscus').focusout(function() {
        blockSearchFocusGiscus = false;
    });

    let doingSearch = false;

    $('#search').focusin(function() { doingSearch = true })
    $('#search').focusout(function() { doingSearch = false })

    // Keyboard-Support
    $(document).keyup(function(e) {
        if (e.keyCode === 27) {
            // Close topnav on escape
            if (!$('nav#topnav').hasClass('permanentTopNav'))
                $('nav#topnav').slideUp()
                doingSearch = false
            $('#search').autocomplete('val', '')
        } else if (e.keyCode === 83 && !(blockSearchFocusCommento || blockSearchFocusUtterances || blockSearchFocusGiscus)) {
            // Activate topnav search with S
            if (!$('nav#topnav').hasClass('permanentTopNav'))
                $('nav#topnav').slideDown()
                doingSearch = true
            $('#search').focus()
        } else if (e.keyCode === 80 && !doingSearch) {
            // Toggle narration with P.
            // Note: jQuery doesn't play nice with this at all,
            // just returning a jQuery.fn.init,
            // So this can't be done with it for some reason.
            if (document.getElementById('narration-player')) {
                player = document.getElementById('narration-player')
                if (player.paused) {
                    player.play()
                } else {
                    player.pause()
                }
            }
        }
    })

    // Flexslider
    $('.flexslider').flexslider({
        animation: 'slide',
        prevText: '',
        nextText: '',
        pauseOnHover: true,
    })

    // Actually have color when using checkbox lists
    // For explanation: by default, Goldmark will add the 'disabled'
    // attribute to all checkboxes in a '- [x] checkbox list', which
    // makes them not clickable, but also greyed out.
    //
    // By replacing that with 'onclick="return false"', we can retain
    // the non-user-editable aspect while allowing them to actually
    // be colored in. Why does returning false prevent the state toggle?
    // Apparently someone thought that onclick() should have the ability
    // to be used to decide if a(n) (un)check action should actually be
    // valid or not. I was today years old when I learned this.
    $('.content ul li input[type=checkbox]').each(function() {
        $(this).attr('onclick', 'return false')
        $(this).prop('disabled', null)
    })

    class Accordion {
        constructor(el) {
            // Store the <details> element
            this.el = el
            // Store the <summary> element
            this.summary = el.querySelector('summary')
            // Store the <div class="content"> element
            this.content = el.querySelector('div')

            // Store the animation object (so we can cancel it if needed)
            this.animation = null
            // Store if the element is closing
            this.isClosing = false
            // Store if the element is expanding
            this.isExpanding = false
            // Detect user clicks on the summary element
            this.summary.addEventListener('click', e => this.onClick(e))
        }

        onClick(e) {
            // Stop default behaviour from the browser
            e.preventDefault()
            // Add an overflow on the <details> to avoid content overflowing
            this.el.style.overflow = 'hidden'
            // Check if the element is being closed or is already closed
            if (this.isClosing || !this.el.open) {
                this.open()
                // Check if the element is being openned or is already open
            } else if (this.isExpanding || this.el.open) {
                this.shrink()
            }
        }

        shrink() {
            // Set the element as "being closed"
            this.isClosing = true

            // Store the current height of the element
            const startHeight = `${this.el.offsetHeight}px`
            // Calculate the height of the summary
            const endHeight = `${this.summary.offsetHeight}px`

            // If there is already an animation running
            if (this.animation) {
                // Cancel the current animation
                this.animation.cancel()
            }

            // Start a WAAPI animation
            this.animation = this.el.animate(
                {
                    // Set the keyframes from the startHeight to endHeight
                    height: [startHeight, endHeight],
                },
                {
                    duration: 300,
                    easing: 'ease-out',
                },
            )

            // When the animation is complete, call onAnimationFinish()
            this.animation.onfinish = () => this.onAnimationFinish(false)
            // If the animation is cancelled, isClosing variable is set to false
            this.animation.oncancel = () => (this.isClosing = false)
        }

        open() {
            // Apply a fixed height on the element
            this.el.style.height = `${this.el.offsetHeight}px`
            // Force the [open] attribute on the details element
            this.el.open = true
            // Wait for the next frame to call the expand function
            window.requestAnimationFrame(() => this.expand())
        }

        expand() {
            // Set the element as "being expanding"
            this.isExpanding = true
            // Get the current fixed height of the element
            const startHeight = `${this.el.offsetHeight}px`
            // Calculate the open height of the element (summary height + content height)
            const endHeight = `${this.summary.offsetHeight +
                this.content.offsetHeight}px`

            // If there is already an animation running
            if (this.animation) {
                // Cancel the current animation
                this.animation.cancel()
            }

            // Start a WAAPI animation
            this.animation = this.el.animate(
                {
                    // Set the keyframes from the startHeight to endHeight
                    height: [startHeight, endHeight],
                },
                {
                    duration: 300,
                    easing: 'ease-out',
                },
            )
            // When the animation is complete, call onAnimationFinish()
            this.animation.onfinish = () => this.onAnimationFinish(true)
            // If the animation is cancelled, isExpanding variable is set to false
            this.animation.oncancel = () => (this.isExpanding = false)
        }

        onAnimationFinish(open) {
            // Set the open attribute based on the parameter
            this.el.open = open
            // Clear the stored animation
            this.animation = null
            // Reset isClosing & isExpanding
            this.isClosing = false
            this.isExpanding = false
            // Remove the overflow hidden and the fixed height
            this.el.style.height = this.el.style.overflow = ''
        }
    }

    document.querySelectorAll('details').forEach(el => {
        new Accordion(el)
    })

    /*
    // Magnific Popup for images within articles to zoom them
    // Rendered with Markdown
    $('p img').magnificPopup({
        type: "image",
        image: {
            verticalFit: true,
            titleSrc: 'alt'
        },
        zoom: {
            enabled: true
        },
        callbacks: {
            // Get the src directly from the img-tag instead of an additional tag
            elementParse: function(item) {
              // Function will fire for each target element
              // "item.el" is a target DOM element (if present)
              // "item.src" is a source that you may modify

              item.src = item.el.attr('src')
            }
        },
        // https://github.com/dimsemenov/Magnific-Popup/pull/1017
        // Enabled popup only when image size is greater than content area
        disableOn: function(e) {
            let img = e.target;
            return img.naturalWidth > img.clientWidth;
        }
    });

    // Magnific Popup for images within articles to zoom them
    // Rendered with Asciidoc
    $('.image-block>img').magnificPopup({
        type: "image",
        image: {
            verticalFit: true,
            titleSrc: function (item) {
                return item.el.parent().find('figcaption').text();
            }
        },
        zoom: {
            enabled: true
        },
        callbacks: {
            elementParse: function(item) {
                item.src = item.el.attr('src')
            }
        },
        // https://github.com/dimsemenov/Magnific-Popup/pull/1017
        // Enabled popup only when image size is greater than content area
        disableOn: function(e) {
            let img = e.target;
            return img.naturalWidth > img.clientWidth;
        }
    });


    // Magnific Popup for images within articles to zoom them
    // Rendered with Asciidoc
    $('.image-block').magnificPopup({
        type: "image",
        delegate: "a",
        image: {
            titleSrc: function (item) {
                return item.el.parent().find('figcaption').text();
            },
            verticalFit: true
        },
        zoom: {
            enabled: true
        }
    });
    */

    // Algolia-Search
    if ($('#activate-algolia-search').length) {
        let client = algoliasearch(
            $('#algolia-search-appId').val(),
            $('#algolia-search-apiKey').val(),
        )
        let index = client.initIndex($('#algolia-search-indexName').val())

        let autocompleteSource = $.fn.autocomplete.sources.hits(index, {
            hitsPerPage: 10,
        })
        if ($('#algolia-search-currentLanguageOnly').length) {
            autocompleteSource = $.fn.autocomplete.sources.hits(index, {
                hitsPerPage: 5,
                filters: 'language: ' + $('html').attr('lang'),
            })
        }

        $('#search')
            .autocomplete({ hint: false, autoselect: true, debug: false }, [
                {
                    source: autocompleteSource,
                    displayKey: function(suggestion) {
                        return suggestion.title || suggestion.author
                    },
                    templates: {
                        suggestion: function(suggestion) {
                            return (
                                "<span class='entry " +
                                suggestion.type +
                                "'>" +
                                "<span class='title'>" +
                                suggestion.title +
                                '</span>' +
                                "<span class='fas fa-fw " +
                                suggestion.iconClass +
                                "'></span>" +
                                '</span>'
                            )
                        },
                        empty: function() {
                            return (
                                "<span class='empty'>" +
                                $('#algolia-search-noSearchResults').val() +
                                '</span>'
                            )
                        },
                        footer: function() {
                            return (
                                '<div class="branding">Powered by <img src="' +
                                $('meta[name=siteBaseUrl]').attr('content') +
                                '/algolia-logo-light.svg" alt="algolia" /></div>'
                            )
                        },
                    },
                },
            ])
            .on('autocomplete:selected', function(event, suggestion, dataset) {
                window.location = suggestion.url
            })
            .keypress(function(event, suggestion) {
                if (event.which == 13) {
                    window.location = suggestion.url
                }
            })
    }

    // MomentJS
    language = $('html').attr('lang')
    moment.locale(language)
    $('.moment').each(function() {
        date = $(this).text()
        $(this).text(moment(date).format('LL'))
    })

    // Mathjax No-JS
    $('.math-container').each(function() {
	this.innerHTML = this.getAttribute('data-mathjax')
    })

    // Subtitle tagline refresh on click
    $('.subtitle').click(setTagline)

    // Toggle temps
    updateTemps()
    $('.temperature-reading').click(changeTempUnit)
})

hljs.highlightAll()

// Do tagline fetch
let xmlHttp = new XMLHttpRequest()
xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	taglines = xmlHttp.responseText.split('\n')
	setTagline()
    }
}

xmlHttp.open('GET', '/taglines.txt', true)
xmlHttp.send(null)
