// Fired on clicking a temperature figure
function change_temp_unit() {
    var temp_in_f = localStorage.getItem('temp_in_f') === 'false'
    localStorage.setItem('temp_in_f', temp_in_f) // Toggle F <-> C and store
    update_temps()
}

// DRY. Actually updates all the values,
// required to run once at start to populate.
function update_temps() {
    var temp_in_f = localStorage.getItem('temp_in_f') === 'true'

    // Default to displaying in C if unspecificed (aka never ran before)
    if (temp_in_f === null) {
        localStorage.setItem('temp_in_f', false)
        temp_in_f = false
    }

    // Process each figure
    var temps = document.getElementsByClassName('temperature-reading')
    for (var i = 0; i < temps.length; i++) {
        var temp = temps[i]
        var temp_c = parseFloat(temp.getAttribute('data-temp')) // ALWAYS in C
        if (temp_in_f === true) {
            // Only run conversion math if requested
            temp.innerHTML =
                (Math.round((temp_c * 1.8 + 32) * 100) / 100).toString() +
                '°' +
                'F'
        } else {
            temp.innerHTML =
                (Math.round(temp_c * 100) / 100).toString() + '°' + 'C'
        }
    }
}

// On load, run once to process everything
update_temps()
