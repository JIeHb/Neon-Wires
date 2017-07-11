var Board = {}
Board.width = 8
Board.height = 8
Board.array = []


var random = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

Board.generate = function(width=Board.width, height=Board.height) {

	let seed_figures = "0011010222112210102112020121011110010";
	let seed_ways = "2221001111123332211123333322112101112";
	
	Board.width = width
	Board.height = height

	for (let y = 0; y < Board.height + 2; y++) {
		let obj_class = 'class="border"'
		if (y-1 >= 0 && y-1 < Board.height) {
			obj_class = ""
		}

		$("#game_board").append('<tr id="'+(y-1)+'" ' + obj_class + '>')
	}

	for (let x = 0; x < Board.width + 2; x++) {

		let obj_class = 'class="border"'
		if (x-1 >= 0 && x-1 < Board.width) {
			obj_class = 'class="cell"'
		}

		let str = '<td id="'+(x-1)+'" ' + obj_class + ' />'
		$("tr").append(str)
	}

	Board.array = []
	
	let figures = [Figures.line, Figures.angle, Figures.cross]

	for (let x = 0; x < Board.width; x++) {
		
		Board.array[x] = []

		for (let y = 0; y < Board.height; y++) {

			//SSID Generator

			Board.array[x][y] = new Figure(figures[random(0, figures.length)])
			Board.array[x][y].rotation_id = random(0, 4)

		}
	}

	let ways = [[-1, 0], [0, 1], [1, 0], [0, -1]]

	let i = -1
	let j = 0

	for (let k = 0; k < seed_ways.length; k++) {

		i += ways[seed_ways[k]*1][0]
		j += ways[seed_ways[k]*1][1]
		Board.array[i][j] = new Figure(figures[seed_figures[k]])
		Board.array[i][j].rotation_id = random(0, 4)

	}
}

Board.draw = function() {

	for (let x = 0; x < Board.width; x++) {
		for(let y = 0; y < Board.height; y++) {
	
			let image = 'url("img/' + Board.array[x][y].image + '")'
			let angle = "rotate(" + Board.array[x][y].rotation_id*90 + "deg)"

			let cell = $(".cell:eq(" + (Board.width*(x+1) + y) + ")")

			cell.css("background-image", image)
			cell.css("transform", angle)
		}
	}
}

Board.onclick = function(x=0, y=0) {

	Board.array[x][y].rotate()
}

Board.is_solved = function() {

	let i = 0
	let j = 0

	let is_end = false
	let from = 0

	let figure = Board.array[i][j]
	let bridge = figure.rotate(figure.rotation_id)

	if (!bridge[0]) {
		return false
	} 

	let ways = [[-1, 0], [0, 1], [1, 0], [0, -1]]

	figure.set_visited(true)

	while (!is_end) {

		let is_valid = false

		figure = Board.array[i][j]
		bridge = figure.rotate(figure.rotation_id)
		
		for (let k = 0; k < ways.length; k++) {

			let index_x = i + ways[k][0]
			let index_y = j + ways[k][1]

			if (index_x < 0 || index_y < 0 ) {
				continue 
			}
			if (index_x > Board.height - 1 || index_y > Board.width - 1) {
				continue
			}

			let next_figure = Board.array[index_x][index_y]
			let next_bridge = next_figure.rotate(next_figure.rotation_id)
			if (bridge[k] > 0 && bridge[k] == bridge[from] && k != from && next_bridge[(k+2) % next_bridge.length] > 0) {

				i += ways[k][0]
				j += ways[k][1]

				figure = Board.array[i][j]
				figure.set_visited(true)

				from = (k + 2) % ways.length
				bridge = figure.rotate(figure.rotation_id)

				if (i == Board.height - 1 && j == Board.width - 1 && bridge[2] && bridge[2] == bridge[from]) {
					
					is_end = true
				}

				is_valid = true
				break
			}
		}
		if (!is_valid){
			return false
		}
	}

	return true
}